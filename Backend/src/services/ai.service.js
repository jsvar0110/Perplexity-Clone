import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from '@langchain/mistralai'
import { ChatGroq } from "@langchain/groq"
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain"
import * as z from "zod"
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
});

const groqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-2603",
    apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet")
        })
    }
)

// Create each agent once at startup, not per-request
const agents = {
    groq: createAgent({ model: groqModel, tools: [searchInternetTool] }),
    gemini: createAgent({ model: geminiModel, tools: [searchInternetTool] }),
    mistral: createAgent({ model: mistralModel, tools: [searchInternetTool] }),
}

// Order = priority. First is tried first, falls back down the list.
const MODEL_CHAIN = [
    { name: "groq", model: groqModel, agent: agents.groq },
    { name: "gemini", model: geminiModel, agent: agents.gemini },
    { name: "mistral", model: mistralModel, agent: agents.mistral },
]

function isRetryableError(err) {
    const status = err?.status || err?.statusCode || err?.error?.code;

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        /429|quota|rate.?limit|overloaded|temporarily unavailable|service unavailable/i
            .test(err?.message || "")
    );
}

async function runWithFallback(fn) {
    let lastErr;
    for (const entry of MODEL_CHAIN) {
        const start = Date.now();
        try {
            const res = await fn(entry);
            console.log(`[${entry.name}] succeeded in ${Date.now() - start}ms`)
            return res;
        } catch (err) {
            console.warn(`[${entry.name}] failed in ${Date.now() - start}ms`, err.message);
            lastErr = err;

            if (isRetryableError(err)) continue;

            throw err; // non-retryable error — surface it immediately
        }
    }
    throw lastErr; // all models exhausted
}

export async function generateResponse(messages) {

    const langchainMessages = [
        new SystemMessage(`Your name is Veltrix, you are a helpful and precise assistant made by Varad.
                        Today's date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

                        You are capable of reasoning, math, writing, coding, and general problem-solving on your own — 
                        use your own knowledge and reasoning to answer directly whenever possible.

                        Only use the "searchInternet" tool when the question depends on current events, 
                        real-time data, or information that could have changed after your training 
                        (e.g. news, prices, recent releases). Do not use it for math, logic, writing, or 
                        general knowledge questions — answer those yourself.

                        If a question mentions words like "recently", "latest", "this week", "today", 
                        or refers to a specific event/person/statement without giving a date, ALWAYS use 
                        searchInternet first — even if you feel confident you already know the answer. 
                        Your training data has a cutoff and can be outdated; world events change quickly, 
                        and a similar-sounding event may have already happened before under different 
                        circumstances. Never answer such questions purely from memory.

                        If you genuinely don't know something and search didn't help, say so — do not guess.`),

        ...(messages
            .map(msg => {
                if (msg.role === "user") return new HumanMessage(msg.content);
                if (msg.role === "ai") return new AIMessage(msg.content);
                return null; // unknown role — drop it instead of pushing undefined
            })
            .filter(Boolean)
        )
    ]

    const response = await runWithFallback(async ({ agent }) => {
        return await agent.invoke({ messages: langchainMessages })
    })

    const last = response.messages[response.messages.length - 1];
    return typeof last.content === "string"
        ? last.content
        : last.content.filter(b => b.type === "text").map(b => b.text).join("");
}


export async function streamResponse(messages, sendEvent) {

    const langchainMessages = [
        new SystemMessage(`Your name is Veltrix, you are a helpful and precise assistant made by Varad.
                        
                        Today's date is ${new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}.

                        You are capable of reasoning, math, writing, coding, and general problem-solving on your own.

                        Only use the "searchInternet" tool when the question depends on current events,
                        real-time data, or information that could have changed after your training.

                        If a question mentions words like "recently", "latest", "this week", "today",
                        or refers to a specific event/person/statement without giving a date,
                        ALWAYS use searchInternet first.

                        If you genuinely don't know something and search didn't help, say so.
                        Do not guess.`),

        ...(messages
            .map(msg => {
                if (msg.role === "user") {
                    return new HumanMessage(msg.content)
                }

                if (msg.role === "ai") {
                    return new AIMessage(msg.content)
                }

                return null
            })
            .filter(Boolean)
        )
    ]

    let fullResponse = ""

    const agent = agents.groq

    sendEvent({
        type: "status",
        status: "thinking",
        message: "Understanding your question..."
    })

    try {

        const stream = await agent.streamEvents(
            {
                messages: langchainMessages
            },
            {
                version: "v2"
            }
        )

        for await (const event of stream) {

            // =========================================
            // TOOL START
            // =========================================

            if (event.event === "on_tool_start") {

                if (event.name === "searchInternet") {

                    sendEvent({
                        type: "status",
                        status: "searching",
                        message: "Searching the web..."
                    })
                }
            }


            // =========================================
            // TOOL END
            // =========================================

            if (event.event === "on_tool_end") {

                if (event.name === "searchInternet") {

                    sendEvent({
                        type: "status",
                        status: "researching",
                        message: "Reviewing search results..."
                    })
                }
            }


            // =========================================
            // MODEL STREAM
            // =========================================

            if (event.event === "on_chat_model_stream") {

                const chunk = event.data?.chunk

                if (!chunk) continue

                let text = ""

                if (typeof chunk.content === "string") {

                    text = chunk.content

                } else if (Array.isArray(chunk.content)) {

                    text = chunk.content
                        .filter(item => item.type === "text")
                        .map(item => item.text)
                        .join("")
                }

                if (!text) continue

                fullResponse += text

                sendEvent({
                    type: "token",
                    content: text
                })
            }
        }

        sendEvent({
            type: "complete"
        })

        return fullResponse

    } catch (error) {

        console.error("Streaming AI error:", error)

        sendEvent({
            type: "error",
            message: "Something went wrong while generating the response."
        })

        throw error
    }
}



export async function generateChatTitle(message) {

    const response = await runWithFallback(async ({ model }) => {
        return await model.invoke([
            new SystemMessage(`You generate short chat titles.

                Rules:
                - Output ONLY the title text, nothing else.
                - No quotes, no punctuation at the end, no preamble like "Here is your title:".
                - Maximum 4 words.
                - Must clearly reflect the topic of the user's message.`),
            new HumanMessage(`First message: "${message}"`)
        ])
    })

    return response.content
}