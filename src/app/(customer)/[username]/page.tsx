import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RenderOrderNumber from "@/src/components/customer/RenderOrderNumber";
import CustomerHomeHeader from "@/src/components/customer/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/CustomerHomeLinks";

export default async function CustomerHome() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: userOrderNumber, error } = await supabase
    .from("user_missions")
    .select("number_of_orders")
    .eq("user_id", user.id);

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader />
      <CustomerHomeLinks />
      <RenderOrderNumber
        userOrderNumber={
          userOrderNumber ? userOrderNumber[0].number_of_orders : 0
        }
      />
    </section>
  );
}
