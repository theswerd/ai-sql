import { tool } from "ai";
import { z } from "zod";

export interface Schema {
  database: string;
  description: string;
}

export interface Database {
  initialize: () => Promise<void>;

  describe: () => Promise<Schema>;

  query: (query: string) => Promise<object[]>;
}

const descriptionTemplate = (schema: object) =>
  `Query a database with the following schema:\n\n${JSON.stringify(schema)}`;

export async function sqlTool(db: Database) {
  await db.initialize();

  const schema = await db.describe();

  return tool({
    description: descriptionTemplate(schema),

    execute: async ({ query }) => {
      return await db.query(query);
    },

    parameters: z.object({
      query: z.string().describe(`${schema.database} Query to execute`),
    }),
  });
}
