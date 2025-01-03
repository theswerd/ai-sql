# AI SQL

Tools for Vercel AI SDK that lets your AI query PostgreSQL, MySQL or SQLite databases in one line.

## Usage

```ts
import * as ai from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { postgres } from "ai-sql"; // or mysql, sqlite

const openai = createOpenAI({
  compatibility: "strict",
});

const { text } = await ai.generateText({
  model: openai("gpt-4-turbo"),
  prompt: "",
  tools: {
    database: await postgres(process.env.POSTGRES_URL!),
  },
  maxSteps: 3,
});
```
