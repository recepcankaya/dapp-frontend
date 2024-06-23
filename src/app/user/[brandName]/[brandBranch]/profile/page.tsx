import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import ProfileHOC from "@/src/components/customer/profile/ProfileHOC";
import getUserID from "@/src/lib/getUserID";

export default async function Profile({
  searchParams,
}: {
  searchParams: { brandID: Brand["id"]; branchID: BrandBranch["id"] };
}) {
  noStore();
  const supabase = createClient();
  const userID = await getUserID();

  const { data: userTotalFreeRights, error } = await supabase
    .from("user_orders")
    .select("user_total_free_rights")
    .eq("user_id", userID)
    .eq("brand_id", searchParams.brandID);

  if (!userTotalFreeRights) {
    return;
  }

  const totalFreeRights = userTotalFreeRights.reduce(
    (total, item) => total + item.user_total_free_rights,
    0
  );

  const { data: freeRightImageUrl, error: error1 } = await supabase
    .from("brand")
    .select("free_right_image_url")
    .eq("id", searchParams.brandID)
    .single();

  return (
    <div className="flex flex-col items-center">
      <ProfileHOC
        userID={userID}
        userTotalFreeRights={totalFreeRights}
        freeRightImageUrl={freeRightImageUrl?.free_right_image_url}
      />
    </div>
  );
}
