export function isRetryableError(err) {
  const status = err?.status || err?.statusCode || err?.error?.code;

  return (
    status === 429 ||
    status === 402 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    /429|quota|rate.?limit|overloaded|temporarily unavailable|service unavailable/i.test(
      err?.message || "",
    )
  );
}

export async function runWithFallback(fn, chain) {
  let lastErr;
  for (const entry of chain) {
    const start = Date.now();

    try {
      const result = await fn(entry);

      console.log(`[${entry.name}] succeeded in ${Date.now() - start}ms`);

      return result;
    } catch (err) {
      console.warn(
        `[${entry.name}] failed in ${Date.now() - start}ms`,
        err.message,
      );

      lastErr = err;

      if (isRetryableError(err)) continue;

      throw err; // non-retryable error — surface it immediately
    }
  }
  throw lastErr; // all models exhausted
}

export async function* getStreamWithFallback(langchainMessages, chain) {
  let lastErr;

  let isFirstAttempt = true;

  for (const entry of chain) {
    const start = Date.now();

    yield { type: "restart", usedModel: entry.name, isFirstAttempt };
    isFirstAttempt = false;

    try {
      const stream = entry.agent.streamEvents(
        {
          messages: langchainMessages,
        },
        {
          version: "v2",
        },
      );

      let gotFirstChunk = false;

      for await (const event of stream) {
        if (!gotFirstChunk) {
          gotFirstChunk = true;
          console.log(
            `[${entry.name}] stream started in ${Date.now() - start}ms`,
          );
        }

        yield { type: "event", usedModel: entry.name, event };
      }

      console.log(
        `[${entry.name}] stream completed in ${Date.now() - start}ms`,
      );

      return;
    } catch (err) {
      console.warn(
        `[${entry.name}] stream failed in ${Date.now() - start}ms`,
        err.message,
      );

      lastErr = err;

      if (isRetryableError(err)) {
        continue;
      }

      throw err;
    }
  }

  throw lastErr;
}
