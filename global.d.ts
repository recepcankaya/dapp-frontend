import type { Database as DB } from "./src/lib/types/database.types";

declare global {
  type Database = DB;
  type Brand = DB["public"]["Tables"]["brand"]["Row"];
  type BrandBranch = DB["public"]["Tables"]["brand_branch"]["Row"];
  type Campaigns = DB["public"]["Tables"]["campaigns"]["Row"];
  type UserOrders = DB["public"]["Tables"]["user_orders"]["Row"];
  type User = DB["public"]["Tables"]["users"]["Row"];
}
