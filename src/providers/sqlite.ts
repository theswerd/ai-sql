import { RunResult, Database as SQLite } from "sqlite3";
import { Schema, Database } from "../database";

export class SqliteTool implements Database {
  private path: string;
  private db: SQLite;

  constructor(dbPath: string) {
    this.path = dbPath;
  }

  static inMemory() {
    return new SqliteTool(":memory:");
  }

  async initialize() {
    this.db = await new Promise((resolve, reject) => {
      const sqlite = new SQLite(this.path, (err) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(sqlite);
        }
      });
    });
  }

  async describe(): Promise<Schema> {
    return {
      database: "PostgreSQL",
      description: "",
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
