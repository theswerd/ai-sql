import { tool } from "ai";
import { z } from "zod";
import { Client, QueryResult } from "pg";

export const postgreSQLTool = async (database_url: string) => {
  const client = new Client(database_url);
  await client.connect();

  const result = await client.query(`
    SELECT table_schema,
       table_name,
       string_agg(
           format('%s %s %s', column_name,
                  CASE
                    WHEN data_type = 'character varying' THEN 'VARCHAR(' || character_maximum_length || ')'
                    WHEN data_type = 'numeric' THEN 'NUMERIC(' || numeric_precision || ',' || numeric_scale || ')'
                    WHEN data_type = 'character' THEN 'CHAR(' || character_maximum_length || ')'
                    ELSE data_type
                  END,
                  CASE WHEN is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END),
           ',\n  ' ORDER BY ordinal_position
       ) AS columns
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
GROUP BY table_schema, table_name
ORDER BY table_schema, table_name;
`);

  const createTableStatements = result.rows.map((row) => {
    const { table_schema, table_name, columns } = row;

    // Construct the CREATE TABLE statement
    return `
CREATE TABLE ${table_schema}.${table_name} (
  ${columns}
);
    `.trim();
  });

  let schema = createTableStatements.join("\n\n");

  return tool({
    description: `Query PostgreSQL Database with the following schema:\n\n${schema}`,
    execute: async (query) => {
      const result = await client.query(query.query!);
      console.log(result);

      const res = Array.isArray(result) ? result : [result];
      const rows = res.map((r: QueryResult) => r.rows);

      return rows;
    },
    parameters: z.object({
      query: z.string().describe("SQL Query to execute"),
    }),
  });
};
