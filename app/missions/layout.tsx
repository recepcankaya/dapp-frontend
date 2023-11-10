"use client";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="bg-[#9376E0] text-black flex items-center justify-between pt-8">
        <div className="flex flex-col items-center ml-8">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="bg-[#F5EA5AA6] border border-missionBorder rounded-[90px] mt-4 px-8 py-2 font-bold">
            Matilda
          </div>
        </div>
        <div className="p-2">
          <ConnectWallet
            // @todo - Change the secondary text
            theme={darkTheme({
              colors: { secondaryText: "#000" },
            })}
            className="!bg-[#F5EA5AA6] !border !border-missionBorder !rounded-[90px] !mr-8 hover:!bg-[#EB596E]"
          />
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}
