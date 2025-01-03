import { PostgresTool } from "./providers/postgres";
import { sqlTool } from "./database";

export async function postgres(dbUrl: string) {
  return await sqlTool(new PostgresTool(dbUrl));
}
