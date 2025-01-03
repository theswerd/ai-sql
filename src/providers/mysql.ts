import * as mysql from "mysql2";

import { Schema, Database } from "../database";

export class MySQLTool implements Database {
  private url: string;
  private client: mysql.Connection;

  constructor(dbUrl: string) {
    this.url = dbUrl;
  }

  async initialize() {
    this.client = mysql.createConnection(this.url);
    this.client.connect();
  }

  async describe(): Promise<Schema> {
    const res: {
      table_schema: string;
      table_name: string;
      columns: string;
    }[] = await new Promise((resolve, reject) =>
      this.client.query(
        {
          sql: `SELECT table_schema,
       table_name,
       GROUP_CONCAT(
           CONCAT(
               column_name, ' ',
               CASE
                   WHEN data_type = 'varchar' THEN CONCAT('VARCHAR(', character_maximum_length, ')')
                   WHEN data_type = 'char' THEN CONCAT('CHAR(', character_maximum_length, ')')
                   WHEN data_type = 'decimal' THEN CONCAT('DECIMAL(', numeric_precision, ',', numeric_scale, ')')
                   ELSE data_type
               END, ' ',
               IF(is_nullable = 'YES', 'NULL', 'NOT NULL')
           ) ORDER BY ordinal_position
           SEPARATOR '\n' -- Newline separator
       ) AS columns
FROM information_schema.columns
WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
GROUP BY table_schema, table_name
ORDER BY table_schema, table_name;
`,
        },
        (err, rows, _fields) => {
          if (err) {
            reject(err);
          }
          resolve(rows as any);
        }
      )
    );

    const createTableStatements = res.map((row) => {
      const { table_schema, table_name, columns } = row;

      // Construct the CREATE TABLE statement
      return `
          CREATE TABLE ${table_schema}.${table_name} (
            ${columns}
          );
        `.trim();
    });

    const schema = createTableStatements.join("\n\n");

    return {
      database: "MySQL",
      description: schema,
    };
  }

  async query(query: string): Promise<object[]> {
    const res = await new Promise((resolve, reject) =>
      this.client.query({ sql: query }, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      })
    );

    return res as object[];
  }
}
