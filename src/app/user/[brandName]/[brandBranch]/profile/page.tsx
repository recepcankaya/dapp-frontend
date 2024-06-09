import { redirect } from "next/navigation";

import { createClient } from "@/src/lib/supabase/server";
import ProfileHOC from "@/src/components/customer/profile/ProfileHOC";
import getUserID from "@/src/lib/getUserID";

export default async function Profile({
  searchParams,
}: {
  searchParams: { brandID: Brand["id"]; branchID: BrandBranch["id"] };
}) {
  const supabase = createClient();
  const userID = await getUserID();

  const { data: username } = await supabase
    .from("users")
    .select("username")
    .eq("id", userID)
    .single();

  if (!username?.username) {
    redirect("/user/user-info");
  }

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
    <div className="flex flex-col items-center pt-16">
      <h1 className="text-xl mb-16 text-black">{username?.username}</h1>
      <ProfileHOC
        userID={userID}
        userTotalFreeRights={totalFreeRights}
        freeRightImageUrl={freeRightImageUrl?.free_right_image_url}
      />
    </div>
  );
}
