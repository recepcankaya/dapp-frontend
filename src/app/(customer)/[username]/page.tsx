"use client";

// @todo - turn into server component

import { useEffect, useState } from "react";

import useUserStore from "@/src/store/userStore";
import useAdminStore from "@/src/store/adminStore";
import CustomerHomeHeader from "@/src/components/customer/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/CustomerHomeLinks";
import { createClient } from "@/src/lib/supabase/client";
import useSession from "@/src/store/session";

const CustomerHome = () => {
  const [userOrderNumber, setUserOrderNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const session = useSession((state) => state.session);
  const userID = useUserStore((state) => state.user.id);
  const admin = useAdminStore((state) => state.admin);
  const ticketCircles = new Array(admin.numberForReward).fill(0);
  const supabase = createClient();

  const fetchUserOrderNumber = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_missions")
        .select("number_of_orders")
        .eq("user_id", session?.user?.id)
        .eq("admin_id", localStorage.getItem("adminID"));

      if (error) {
        console.log(error);
      } else {
        setUserOrderNumber(data[0]?.number_of_orders ?? 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userID && admin.id) {
      fetchUserOrderNumber();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, admin.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader />
      <CustomerHomeLinks />
      <div className="pt-12 h-1/3">
        <p className="text-white mb-4 ml-8">Süreciniz</p>
        <div className="bg-white h-full w-full grid grid-cols-4 justify-items-center items-center">
          {ticketCircles.map((item, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-full"
              style={{
                backgroundColor:
                  index < userOrderNumber ? "#87A922" : "#C8AFD6",
              }}></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerHome;
