// import fs from "fs/promises"
// import path from "path"
import crypto from "crypto"
import { runWithFallback } from "./ai/fallback.js"

// const OUT_DIR = path.resolve("public/generated")

const providers = {
  cloudflare: async (m, prompt) => {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${m.accountId}/ai/run/${m.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${m.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, steps: m.steps }),
      }
    );

    if (!res.ok) {
      const err = new Error(`${m.id} failed: ${res.status} ${await res.text()}`);
      err.status = res.status; // lets isRetryableError() decide whether to fall back
      throw err;
    }

    const data = await res.json();
    const b64 = data?.result?.image ?? data?.image;
    if (!b64) throw new Error(`${m.id} returned no image`);
    return Buffer.from(b64, "base64");
  },
};


export async function generateImage(prompt) {

  const { IMAGE_CHAIN } = await import('./ai/chains.js')

  const buffer = await runWithFallback(
    ({ model }) => providers[model.provider](model, prompt),
    IMAGE_CHAIN
  )

  // await fs.mkdir(OUT_DIR , {recursive : true})
  // const name = `${crypto.randomUUID()}.jpg`
  // await fs.writeFile(path.join(OUT_DIR , name) , buffer)

  // const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` ;
  // return `${base}/generated/${name}`    

  const form = new FormData()
  form.append("file", new Blob([buffer], { type: "image/jpeg" }), "image.jpg")
  form.append("fileName", `${crypto.randomUUID()}.jpg`)
  form.append("folder", "/veltrix")

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64"),
    },
    body: form,
  })

  if (!res.ok) throw new Error(`ImageKit upload failed: ${res.status} ${await res.text()}`)

  const data = await res.json()
  return data.url
}