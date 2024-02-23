import Link from "next/link";
import Image from "next/image";

import logo from "@/public/images/logo.jpg";

export default function NavBar() {
  return (
    <nav className="w-full h-20 md:h-24 lg:h-32 2xl:h-48 flex items-center justify-center">
      <div className="h-full w-[90%] flex justify-between items-center">
        <Image
          src={logo}
          alt="logo"
          className="w-16 h-16 md:w-20 md:h-20 lg:h-24 lg:w-24 2xl:h-32 2xl:w-32 object-cover rounded-xl"
        />
        <ul className=" text-sm md:text-base lg:text-2xl 2xl:text-3xl hover:underline hover:underline-offset-2">
          <li>
            <Link href="/contact" className="opacity-0 md:opacity-100">
              Contact us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
