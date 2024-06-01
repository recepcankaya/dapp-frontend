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
        <div className="max-w-sm">
          <ul
            className="flex gap-8 overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}>
            {menu.map((item: CategoryProduct) => (
              <li
                key={item.categoryID}
                onClick={() => setSelectedTab(item.category)}
                className="inline-block select-none"
                style={{
                  textDecoration:
                    selectedTab === item.category ? "underline" : "none",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "4px",
                }}>
                {item.category}
              </li>
            ))}
          </ul>
          <ul className="mt-12">
            {menu
              .filter((item: CategoryProduct) => selectedTab === item.category)
              .flatMap((item: CategoryProduct) =>
                item.products?.map((product: Product) => (
                  <li key={product.id}>
                    <p>{product.name}</p>
                    <p>{product.price}</p>
                    <p>{product.description}</p>
                    {/* <Image
            src={product.image.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            )}
            alt={product.name}
            width={100}
            height={100}
          /> */}
                  </li>
                ))
              )}
          </ul>
        </div>
      ) : (
        <p>Menü bulunamadı</p>
      )}
    </>
  );
}
