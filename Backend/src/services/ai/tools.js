import { tool } from "langchain";
import * as z from 'zod'
import { generateImage } from "../image.service.js";

import { searchInternet } from "../internet.service.js";

export const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet"),
  }),
});


export const generateImageTool = tool (
  async({prompt}) => { 
    try {

      return `IMAGE_URL:${await generateImage(prompt)}`
      
    } catch (e) {
      
      return `Image generation failed : ${e.message}`

    }
  } ,
  {
    name : "generateImage" ,
    description :
    "Generate an image from a text description. Use when the user asks to create, draw, generate or imagine a picture/illustration/photo. Pass a detailed English prompt (subject, style, lighting, composition).",
    schema : z.object({
      prompt: z.string().describe("Detailed English description of the image ") ,
    }),
  }
)
