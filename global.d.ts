import { Database as DB } from "./src/lib/database.types";

declare global {
  type Database = DB;
}
