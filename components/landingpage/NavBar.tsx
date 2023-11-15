import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ConnectWallet,
  useAddress,
  useWallet,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { motion } from "framer-motion";

import logo from "@/public/images/logo.jpg";
import { useState } from "react";

type User = {
  username: string;
  email: string;
  wallet: string;
};

export default function NavBar() {
  const router = useRouter();
  const connectionStatus = useConnectionStatus();
  const loggedAddress = useAddress();
  const embeddedWallet = useWallet("embeddedWallet");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch("/api");
    const data = await res.json();
    const loggedEmail = await embeddedWallet?.getEmail();
    data.map((user: User) => {
      const { username, email, wallet } = user;
      if (loggedEmail === email || loggedAddress === wallet) {
        router.push(`/${username}`);
      } else {
        // router.push("/login");
      }
    });
    setLoading(false);
  };

  if (connectionStatus === "connected" && !loading) {
    handleLogin();
  }

  return (
    <nav className="w-full h-20 md:h-24 lg:h-32 2xl:h-48 bg-gradient-to-b from-[#574E70]/75 to-[#0A002F]/0">
      <div className="h-full flex justify-around items-center">
        <Image
          src={logo}
          alt="logo"
          className="w-12 h-12 md:w-16 md:h-16 lg:h-20 lg:w-20 2xl:h-28 2xl:w-28 object-cover rounded-xl"
        />
        <ul className="w-2/5 mr-3 flex justify-around items-center text-sm md:text-base lg:text-lg 2xl:text-2xl italic font-bold">
          <li>
            <Link href="/contact" className="opacity-0 md:opacity-100">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/about" className="opacity-0 md:opacity-100">
              About Us
            </Link>
          </li>
          <motion.li
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.9 }}>
            <ConnectWallet
              className="!h-8 !min-w-[auto] !px-4 !py-1 md:!px-5 md:!py-3 lg:!px-7 lg:!py-5 
              2xl:!px-9 2xl:!py-7 2xl:!rounded-lg !text-sm md:!text-base lg:!text-lg 2xl:!text-2xl !bg-foreground !text-bgColor hover:bg-gradient-to-r from-btnNotifyColor to-purpleColor hover:!text-foreground"
              btnTitle="Login"
              modalTitle="Select an option"
              modalTitleIconUrl=""
              welcomeScreen={{
                title: "Welcome to Ladder It",
                subtitle:
                  "The app that superpowers your habits and rewards you in exchange",
              }}
            />
          </motion.li>
        </ul>
      </div>
    </nav>
  );
}
