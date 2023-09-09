import Link from "next/link";
import CustomButton from "./CustomButton";

export default function NavBar() {
  return (
    <nav className="w-full h-44 bg-gradient-to-b from-[#574E70]/75 to-[#0A002F]/0">
      <div className="h-full pt-5 flex justify-around gap-36">
        <h1 className="text-3xl">Ladderit</h1>
        <ul className="w-1/2 flex justify-between text-2xl italic font-bold">
          <Link href="" className="">
            Contact
          </Link>
          <Link href="" className="">
            About Us
          </Link>
          <Link href="" className="">
            Pricing
          </Link>
          <CustomButton
            text="Log In"
            classNames="w-1/4 h-10 bg-btnNotifyColor rounded-3xl italic"
          />
        </ul>
      </div>
    </nav>
  );
}
