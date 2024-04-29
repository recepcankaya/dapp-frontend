import type { Database as DB } from "./src/lib/database.types";

declare global {
  type Database = DB;
  type Admin = DB["public"]["Tables"]["admins"]["Row"];
  type UserMission = DB["public"]["Tables"]["user_missions"]["Row"];
  type User = DB["public"]["Tables"]["users"]["Row"];
}
