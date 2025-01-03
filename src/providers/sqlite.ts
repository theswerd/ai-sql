import { RunResult, Database as SQLite } from "sqlite3";
import { Schema, Database } from "../database";

function getDatabaseSchema(db: SQLite): Promise<string> {
  return new Promise((resolve, reject) => {
    // Retrieve all "normal" tables (exclude SQLite's internal tables)
    const getTablesQuery = `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `;

    db.all(getTablesQuery, [], (err, tables) => {
      if (err) {
        return reject(`Failed to retrieve tables: ${err.message}`);
      }

      if (!tables.length) {
        return resolve("No tables in this database.");
      }

      let schemaOutput = "";
      let pendingTables = tables.length;

      // Iterate over tables and get column info
      tables.forEach((name) => {
        db.all(`PRAGMA table_info(${name})`, [], (err, columns) => {
          if (err) {
            return reject(
              `Failed to get table_info for ${name}: ${err.message}`,
            );
          }

          // Add table header
          schemaOutput += `Table: ${name}\n`;

          // List each column with its type and other attributes
          columns.forEach((col) => {
            let columnStr = `  ${col.name} ${col.type}`;
            if (col.pk === 1) {
              columnStr += " PRIMARY KEY";
            }
            if (col.notnull === 1) {
              columnStr += " NOT NULL";
            }
            if (col.dflt_value !== null) {
              columnStr += ` DEFAULT ${col.dflt_value}`;
            }
            schemaOutput += columnStr + "\n";
          });

          // Add a blank line after each table
          schemaOutput += "\n";

          // If all tables have been processed, resolve the output
          pendingTables -= 1;
          if (pendingTables === 0) {
            resolve(schemaOutput.trim());
          }
        });
      });
    });
  });
}

export class SQLiteTool implements Database {
  private path: string;
  private db: SQLite;

  constructor(dbPath: string) {
    this.path = dbPath;
  }

  static inMemory() {
    return new SQLiteTool(":memory:");
  }

  async initialize() {
    this.db = new SQLite(this.path);
  }

  async describe(): Promise<Schema> {
    const description: string = await getDatabaseSchema(this.db);

    return {
      database: "PostgreSQL",
      description: `
sqlite3 database at ${this.path}

schema:
${description}
`.trim(),
    };
  }

  async query(query: string): Promise<unknown[]> {
    return await new Promise((resolve, reject) => {
      this.db.run(query, (res: RunResult, err: Error | null) => {
        if (err !== null) {
          reject(err);
        } else {
          res.all((err, rows) => {
            if (err !== null) {
              reject(err);
            } else {
              resolve(rows as unknown[]);
            }
          });
        }
      });
    });
  }
}
