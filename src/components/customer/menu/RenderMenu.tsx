"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Product = {
  name: string;
  price: number;
  description: string;
  image: string;
  id: string;
};

type CategoryProduct = {
  category: string;
  categoryID: string;
  products: Product[];
};

type Props = {
  menu: CategoryProduct[];
};

export default function RenderMenu({ menu }: Props) {
  const [selectedTab, setSelectedTab] = useState<string>(
    menu.find((item) => item.category === "Önerilenler")?.category || ""
  );
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const scrollRef = useRef<HTMLUListElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current?.offsetLeft!);
    setScrollLeft(scrollRef.current?.scrollLeft!);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current?.offsetLeft!;
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <>
      {menu ? (
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-col justify-center mt-20 gap-y-2">
            <p className="font-bold mb-3 pl-4 sm:pl-5">Menü</p>
            <div
              className="mx-auto grid grid-cols-3 gap-8 justify-center border border-[#DBB5B5] p-5 relative"
              style={{
                borderWidth: "1em",
                maxWidth: "90%",
              }}
            >
              <span className="absolute top-0 left-0 translate-x-[-75%] translate-y-[-75%] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]"></span>
              <span className="absolute top-0 left-0 translate-x-[-86.5%] translate-y-[-86%] w-[14px] h-[14px] rounded-full bg-[#987070]"></span>
              <span className="absolute top-0 right-0 translate-x-[75%] translate-y-[-75%] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]"></span>
              <span className="absolute top-0 right-0 translate-x-[86%] translate-y-[-86%] w-[14px] h-[14px] rounded-full bg-[#987070]"></span>
              {menu.map((item: CategoryProduct) => (
                <li
                  key={item.categoryID}
                  onClick={() => setSelectedTab(item.category)}
                  className="inline-block select-none italic hover:cursor-pointer drop-shadow-2xl"
                  style={{
                    textDecoration:
                      selectedTab === item.category ? "underline" : "none",
                    textDecorationThickness: "1px",
                    textUnderlineOffset: "4px",
                  }}
                >
                  {item.category}
                </li>
              ))}
            </div>
          </div>
          <div className="mt-12 w-[90vw] flex-col">
            <div className="flex-col justify-start ml-1 mb-8">
              <p className="font-bold mt-10">Fiyatlar</p>
              <p className="text-[#00000084]">{selectedTab}</p>
            </div>
            {menu
              .filter((item: CategoryProduct) => selectedTab === item.category)
              .flatMap((item: CategoryProduct) =>
                item.products?.map((product: Product) => (
                  <>
                    <li
                      className="flex items-start justify-between overflow-hidden mb-12"
                      key={product.id}
                    >
                      <Image
                        className="rounded-full"
                        src={product.image.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        )}
                        alt={product.name}
                        width={60}
                        height={60}
                        style={{
                          aspectRatio: "60/60",
                        }}
                      />
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
