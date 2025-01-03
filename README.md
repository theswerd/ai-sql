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

For more examples, see the [example](./example) directory.

## Creating a provider

```typescript
import { Schema, Database, sqlTool } from "ai-sql";

export class MyDbTool implements Database {
  async initialize() {
    // do setup here
  }

  async describe(): Promise<Schema> {
    // describe the schema

    return {
      // database type
      database: "my database",
      // stringified schema representation
      description: `
        create table messages (
          id integer primary key,
          text string not null,
        );
      `,
    };
  }

  async query(query: string) {
    // return result rows here
    return [];
  }
}

const tools = {
  database: await sqlTool(new MyDbTool()),
};
```
