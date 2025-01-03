import { PostgresTool } from "./providers/postgres";
import { sqlTool } from "./database";
import { MySQLTool } from "./providers/mysql";

export async function postgres(dbUrl: string) {
  return await sqlTool(new PostgresTool(dbUrl));
}

export async function mysql(dbUrl: string) {
  return await sqlTool(new MySQLTool(dbUrl));
}
