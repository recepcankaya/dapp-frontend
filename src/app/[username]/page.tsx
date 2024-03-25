"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";

import useUserStore from "../../store/userStore";

import useAdminStore from "../../store/adminStore";
import supabase from "@/src/utils/supabase";
import { useAddress } from "@thirdweb-dev/react";
import logo from "@/src/public/LadderLogo.png";
import { useRouter } from "next/navigation";

const CustomerHome = () => {
  const [userOrderNumber, setUserOrderNumber] = useState<number>(0);
  const userID = useUserStore((state) => state.user.id);
  const admin = useAdminStore((state) => state.admin);
  const brandLogo = useAdminStore((state) => state.admin.brandLogo);
  const username = useUserStore((state) => state.user.username);
  const ticketCircles = new Array(admin.numberForReward).fill(0);
  const router = useRouter();

  const customerAddress = useAddress();

  const fetchUserOrderNumber = async () => {
    try {
      const { data, error } = await supabase
        .from("user_missions")
        .select("number_of_orders")
        .eq("user_id", userID)
        .eq("admin_id", admin.id);
      if (error) {
        console.log(error);
      } else {
        setUserOrderNumber(data[0]?.number_of_orders ?? 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const qrCodeValue = {
    userID,
    forNFT: false,
    address: customerAddress,
  };

  useEffect(() => {
    fetchUserOrderNumber();
  }, []);

  return (
    <section className="h-screen w-screen">
      <div className="p-2 flex justify-around items-center gap-36 border-b-2 border-pink-500">
        <Image
          loading="lazy"
          src={brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt="brand logo"
          width={70}
          height={70}
          className="rounded-2xl cursor-pointer"
        />
        <Image src={logo} alt="Logo" width={80} height={80} />
      </div>
      <div className="pt-12 h-1/3">
        <h2
          onClick={() => router.push(`/${username}/profile`)}
          className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
          Profil
        </h2>
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
      <div className="mt-28 flex justify-center items-center">
        <QRCode
          value={JSON.stringify(qrCodeValue)}
          size={240}
          className="p-4 bg-white rounded-xl"
        />
      </div>
    </section>
  );
};

export default CustomerHome;
