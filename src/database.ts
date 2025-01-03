import { tool } from "ai";
import { z } from "zod";

export interface Schema {
  database: string;
  description: string;
  notes?: string[];
}

export interface Database {
  initialize: () => Promise<void>;

  describe: () => Promise<Schema>;

  query: (query: string) => Promise<unknown[]>;
}

const descriptionTemplate = (schema: unknown) =>
  `Query a database with the following schema:\n\n${JSON.stringify(schema)}`;

export interface SqlToolOptions {
  notes?: string[];
}

export async function sqlTool(db: Database, { notes }: SqlToolOptions = {}) {
  await db.initialize();

  const schema = await db.describe();
  schema.notes = notes;

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
