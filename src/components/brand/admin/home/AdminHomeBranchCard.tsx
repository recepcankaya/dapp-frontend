import Link from "next/link";
import Image from "next/image";

import React from "react";
import { convertString } from "@/src/lib/utils";
import { AdminBrandBranchInfo } from "@/src/lib/types/jsonQuery.types";
type AdminHomeBranchCardProps = {
  brandData: AdminBrandBranchInfo;
};

export default function AdminHomeBranchCard({
  brandData,
}: AdminHomeBranchCardProps) {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {brandData.brand_branch.map((item) => (
  
        <div key={item.id} className="flex flex-col items-center gap-4">
          <Link
            href={`/brand/admin/${convertString(
              brandData.brand_name
            )}/${convertString(item.branch_name)}`}
            prefetch={false}
          >
            <Image
              src={brandData.brand_logo_url}
              alt="brand logo"
              className="rounded-2xl cursor-pointer object-cover border-2 border-lad-pink"
              quality={100}
              priority
              width={100}
              height={100}
            />
          </Link>
          <p className="text-center text-balance">{item.branch_name}</p>
        </div>
      ))}
    </section>
  );
}
