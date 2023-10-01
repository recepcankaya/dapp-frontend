import Link from "next/link";
import CustomButton from "./CustomButton";

export default function NavBar() {
  return (
    <nav className="w-full h-28 lg:h-40 bg-gradient-to-b from-[#574E70]/75 to-[#0A002F]/0">
      <div className="h-full pt-5 flex justify-between">
        <h1 className="ml-6 text-3xl">Ladderit</h1>
        <ul className="w-1/2 mr-3 flex justify-between text-sm sm:text-base md:text-xl lg:text-2xl italic font-bold">
          <Link href="" className="opacity-0 md:opacity-100">
            Contact
          </Link>
          <Link href="" className="opacity-0 md:opacity-100">
            About Us
          </Link>
          <CustomButton
            text="Log In"
            classNames="w-1/4 h-6 md:h-10 bg-btnNotifyColor rounded-3xl italic hover:bg-gradient-to-r from-bgColor to-purpleColor"
          />
        </ul>
      </div>
    </nav>
  );
}
