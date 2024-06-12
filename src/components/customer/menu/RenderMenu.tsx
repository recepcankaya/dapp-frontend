"use client";
import { useRef, useState } from "react";
import Image from "next/image";

import type { CategoryProduct, Product } from "@/src/lib/types/product.types";

type Props = {
  menu: CategoryProduct[];
};

export default function RenderMenu({ menu }: Props) {
  const [selectedTab, setSelectedTab] = useState<string>(
    menu[0].category || ""
  );

  return (
    <>
      {menu && menu.length > 0 ? (
        <div className="flex flex-col justify-center items-center w-full">
          <div className="w-full flex flex-col justify-center mt-20 gap-y-2">
            <h1 className="font-bold mb-3 pl-4 sm:pl-5 text-xl">Menü</h1>
            <div className="flex gap-8 justify-start overflow-y-auto bg-[#DBB5B5] p-6 relative drop-shadow-xl overflow-x-auto">
              {menu.map((item: CategoryProduct) => (
                <li
                  key={item.categoryID}
                  onClick={() => setSelectedTab(item.category)}
                  className="font-bold inline-block select-none hover:cursor-pointer drop-shadow-2xl font-lad-island-moments text-3xl min-w-fit"
                  style={{
                    textDecoration:
                      selectedTab === item.category ? "underline" : "none",
                    textUnderlineOffset: "4px",
                    textShadow: "1px 3px 3px rgba(0, 0, 0, 0.5)",
                  }}>
                  {item.category}
                </li>
              ))}
            </div>
          </div>
          <div className="mt-4 w-[90vw] flex-col">
            <div className="flex-col justify-start ml-1 mb-8">
              <h2 className="font-bold mt-10 text-lg">Fiyatlar</h2>
            </div>
            {menu
              .filter((item: CategoryProduct) => selectedTab === item.category)
              .flatMap((item: CategoryProduct) =>
                item.products?.map((product: Product) => (
                  <>
                    <li
                      className="flex items-start justify-between overflow-hidden mb-12"
                      key={product.id}>
                      <div className="w-[70px] h-[70px] relative">
                        <Image
                          className="rounded-lg"
                          src={product.image}
                          alt={product.name}
                          fill
                        />
                      </div>
                      <div className="flex flex-col w-1/2 justify-center h-[100%]">
                        <p className="font-bold" title={product.name}>
                          {product.name}
                        </p>
                        <p className="break-all" title={product.description}>
                          {product.description}
                        </p>
                      </div>
                      <p className="font-semibold">{product.price}</p>
                    </li>
                  </>
                ))
              )}
          </div>
        </div>
      ) : (
        <p>Menü bulunamadı</p>
      )}
    </>
  );
}
