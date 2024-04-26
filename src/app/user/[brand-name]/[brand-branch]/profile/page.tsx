import { createClient } from "@/src/lib/supabase/server";
import ProfileHOC from "@/src/components/customer/profile/ProfileHOC";

export default async function Profile({
  searchParams,
}: {
  searchParams: { adminID: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: username } = await supabase
    .from("users")
    .select("username")
    .eq("id", user?.id)
    .single();

  const { data: numberOfFreeRights, error } = await supabase
    .from("user_missions")
    .select("number_of_free_rights")
    .eq("user_id", user?.id)
    .eq("admin_id", searchParams.adminID);

  const { data: freeRightImageUrl, error: error1 } = await supabase
    .from("admins")
    .select("free_right_image_url")
    .eq("id", searchParams.adminID);

  return (
    <div className="flex flex-col items-center pt-16 text-white">
      <h1 className="text-xl mb-16 text-white">{username?.username}</h1>
      <ProfileHOC
        userID={user?.id}
        numberOfFreeRights={
          numberOfFreeRights && numberOfFreeRights[0].number_of_free_rights
        }
        freeRightImageUrl={
          freeRightImageUrl && freeRightImageUrl[0].free_right_image_url
        }
      />
    </div>
  );
}