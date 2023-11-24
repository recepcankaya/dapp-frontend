"use client";
import Link from "next/link";
import { ConnectWallet, darkTheme, useAddress } from "@thirdweb-dev/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";

export default function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { user: string };
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/${params.user}/profile`}
                  className="text-sm lg:text-base bg-[#F5EA5AA6] border-2 border-missionBorder rounded-[90px] mt-1 px-4 lg:px-10 py-3 sm:py-4 font-bold text-black hover:bg-[#EB596E]">
                  {params.user}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mr-2 sm:mr-6 md:mr-10">
          <ConnectWallet
            theme={darkTheme({
              colors: { secondaryText: "#000" },
            })}
            detailsBtn={() => (
              <Button className="bg-[#D3C189] border-2 border-missionBorder rounded-[90px] hover:bg-[#EB596E]">
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
