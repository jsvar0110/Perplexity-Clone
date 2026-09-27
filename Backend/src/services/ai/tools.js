import { tool } from "langchain";
import * as z from 'zod'

import { searchInternet } from "../internet.service.js";

export const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet"),
  }),
});
