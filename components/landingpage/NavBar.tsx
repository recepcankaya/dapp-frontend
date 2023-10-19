import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConnectWallet, useConnectionStatus } from "@thirdweb-dev/react";
import { motion } from "framer-motion";

import logo from "@/public/images/logo.jpg";

export default function NavBar() {
  const router = useRouter();
  const connectionStatus = useConnectionStatus();

  if (connectionStatus === "connected") {
    router.push("/missions");
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
              2xl:!px-9 2xl:!py-7 2xl:!rounded-lg !text-sm md:!text-base lg:!text-lg 2xl:!text-2xl !bg-btnNotifyColor !text-foreground hover:bg-gradient-to-r from-background to-purpleColor"
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
