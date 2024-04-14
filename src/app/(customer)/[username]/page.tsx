import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RenderOrderNumber from "@/src/components/customer/RenderOrderNumber";
import CustomerHomeHeader from "@/src/components/customer/CustomerHomeHeader";

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

  // const qrCodeValue = {
  //   userID,
  //   forNFT: false,
  //   address: customerAddress,
  // };

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader />
      <RenderOrderNumber
        userOrderNumber={
          userOrderNumber ? userOrderNumber[0].number_of_orders : 0
        }
      />
      {/* <QRCode
          value={JSON.stringify(qrCodeValue)}
          size={240}
          className="p-4 bg-white rounded-xl"
        /> */}
    </section>
  );
}
