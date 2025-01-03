import { PostgresTool } from "./providers/postgres";
import { sqlTool, SqlToolOptions } from "./database";
import { MySQLTool } from "./providers/mysql";

export async function postgres(dbUrl: string, options?: SqlToolOptions) {
  return await sqlTool(new PostgresTool(dbUrl), options);
}

export async function mysql(dbUrl: string) {
  return await sqlTool(new MySQLTool(dbUrl));
}
