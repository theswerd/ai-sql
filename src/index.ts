import { PostgresTool } from "./providers/postgres";
import { sqlTool, SqlToolOptions } from "./database";
import { MySQLTool } from "./providers/mysql";
import { SQLiteTool } from "./providers/sqlite";

export async function postgres(dbUrl: string, options?: SqlToolOptions) {
  return await sqlTool(new PostgresTool(dbUrl), options);
}

export async function mysql(dbUrl: string, options?: SqlToolOptions) {
  return await sqlTool(new MySQLTool(dbUrl), options);
}

export async function sqlite(dbPath: string, options?: SqlToolOptions) {
  return await sqlTool(new SQLiteTool(dbPath), options);
}
