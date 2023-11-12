"use client";
import { ConnectWallet, darkTheme, useAddress } from "@thirdweb-dev/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const address = useAddress();
  return (
    <>
      <nav className="bg-[#9376E0] text-black flex items-center justify-between pt-8">
        <div className="flex flex-col items-center ml-2 sm:ml-6 md:ml-10">
          <Avatar className="border-2 border-missionBorder lg:w-14 lg:h-14">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="bg-[#F5EA5AA6] border-2 border-missionBorder rounded-[90px] mt-1 px-6 lg:px-10 py-2 font-bold">
            <h2 className="text-sm lg:text-base">Matilda</h2>
          </div>
        </div>
        <div className="mr-2 sm:mr-6 md:mr-10">
          <ConnectWallet
            theme={darkTheme({
              colors: { secondaryText: "#000" },
            })}
            detailsBtn={() => (
              <Button className="bg-[#D3C189] border-2 border-missionBorder rounded-[90px]">
                {address?.slice(0, 5)}...{address?.slice(-4)}
              </Button>
            )}
            className="!bg-[#F5EA5AA6] !border !border-missionBorder !rounded-[90px] !h-12 !w-8 !text-sm hover:!bg-[#EB596E]"
          />
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}
