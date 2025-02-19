import { mysql } from "ai-sql";
import * as dotenv from "dotenv";
import * as ai from "ai";
dotenv.config();

import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  compatibility: "strict",
  apiKey: process.env.OPENAI_API_KEY!,
});

const params = {
  model: openai("gpt-4-turbo"),
  maxSteps: 3,
};

const { text: text1 } = await ai.generateText({
  ...params,
  tools: {
    database: await mysql(process.env.MYSQL_URL!, {
      notes: [
        "SERIAL is an alias for BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE, if you want a foreign key to reference this column, you should use BIGINT UNSIGNED NOT NULL",
      ],
    }),
  },
  prompt:
    "Create an employees table and an hours table to track work, add some example empoyees and hours (about 1 month worth of entries for each employee), and return all employees",
});

console.log("OUTPUT", text1);

const { text: text2 } = await ai.generateText({
  ...params,
  tools: {
    database: await mysql(process.env.MYSQL_URL!, {
      notes: ["Only query tables that exist"],
    }),
  },
  prompt:
    "Please return the 3 employees with the most hours worked, and the hours they worked",
});

console.log("OUTPUT", text2);
