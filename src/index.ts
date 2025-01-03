import { PostgresTool } from "./providers/postgres";
import { sqlTool, SqlToolOptions } from "./database";

export async function postgres(dbUrl: string, options?: SqlToolOptions) {
  return await sqlTool(new PostgresTool(dbUrl), options);
}
