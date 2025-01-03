import { Client, QueryResult } from "pg";

import { Schema, Database } from "../database";

export class PostgresTool implements Database {
  private url: string;
  private client: Client;
  private schema: string;

  constructor(dbUrl: string) {
    this.url = dbUrl;
  }

  async initialize() {
    this.client = new Client(this.url);
    await this.client.connect();

    const result = await this.client.query(`
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

    const schema = createTableStatements.join("\n\n");

    this.schema = schema;
  }

  async describe(): Promise<Schema> {
    return {
      database: "PostgreSQL",
      description: this.schema,
    };
  }

  async query(query: string) {
    const result = await this.client.query(query);

    const res = Array.isArray(result) ? result : [result];
    return res.map((r: QueryResult) => r.rows);
  }
}
