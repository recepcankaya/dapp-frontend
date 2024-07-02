"use client";
import { useState } from "react";
import Image from "next/image";

import type { Product } from "@/src/lib/types/product.types";

type Props = {
  menus: Menus[];
};

export default function RenderMenu({ menus }: Props) {
  // groupedMenus is a Record<string, Menus[]> object that stores the menus grouped by their category. Example: { "category1": [menu1, menu2], "category2": [menu3, menu4] }
  const [menusArray, setMenusArray] = useState<Menus[] | null>(
    menus ? [...menus] : null
  );
  const [selectedTab, setSelectedTab] = useState<string>(
    menusArray?.[0]?.category || ""
  );

  return (
    <>
      {menus && menus.length > 0 ? (
        <div className="flex flex-col justify-center items-center w-full">
          <div className="w-full flex flex-col justify-center mt-20 gap-y-2">
            <h1 className="font-bold mb-3 pl-4 sm:pl-5 text-xl">Menü</h1>
            <div className="flex gap-8 justify-start overflow-y-auto bg-[#DBB5B5] p-6 relative drop-shadow-xl overflow-x-auto">
              {menusArray?.map((product) => (
                <li
                  key={item.categoryID}
                  onClick={() => setSelectedTab(item.category)}
                  className="font-semibold inline-block select-none hover:cursor-pointer  min-w-fit"
                  style={{
                    textDecoration:
                      selectedTab === product.category ? "underline" : "none",
                    textUnderlineOffset: "4px",
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
