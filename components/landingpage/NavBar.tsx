import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import logo from "@/public/images/logo.jpg";
import { Button } from "../ui/Button";

export default function NavBar() {
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch("/api");
    const data = await response.json();
    if (data.error) {
      router.push("/login");
    } else {
      router.push(`/${data.username}`);
    }
  };

  return (
    <header>
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
              <Button
                variant="outline"
                onClick={handleLogin}
                className="bg-transparent border-2 border-[#EB596E] hover:bg-[#D3C189] hover:text-black">
                Login
              </Button>
            </motion.li>
            <motion.li
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </motion.li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
