import { postgreSQLTool } from "../../src";
import * as dotenv from "dotenv";
import * as ai from "ai";
dotenv.config();

import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  compatibility: "strict",
  apiKey: process.env.OPENAI_API_KEY!,
});
const model = openai("gpt-4-turbo", {
  // additional settings
});

const { text } = await ai.generateText({
  model: openai("gpt-4-turbo"),
  prompt:
    "Insert a random name into the employees table, and return all employees",
  tools: {
    postgreSQL: await postgreSQLTool(process.env.POSTGRES_URL!),
  },
  maxSteps: 3,
});

console.log("OUTPUT", text);
