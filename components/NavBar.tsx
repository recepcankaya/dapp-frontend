import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/logo.jpg";
import { Button } from "./ui/Button";

export default function NavBar() {
  return (
    <nav className="w-full h-28 lg:h-40 2xl:h-60 bg-gradient-to-b from-[#574E70]/75 to-[#0A002F]/0">
      <div className="h-full flex justify-around items-center">
        <Image
          src={logo}
          alt="logo"
          className="w-20 h-20 md:w-24 md:h-24 lg:h-32 lg:w-32 2xl:h-44 2xl:w-44 object-cover rounded-xl"
        />
        <ul className="w-1/2 mr-3 flex justify-between items-center text-sm sm:text-base md:text-xl lg:text-2xl 2xl:text-4xl italic font-bold">
          <Link href="/contact" className="opacity-0 md:opacity-100">
            Contact
          </Link>
          <Link href="" className="opacity-0 md:opacity-100">
            About Us
          </Link>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </ul>
      </div>
    </nav>
  );
}
