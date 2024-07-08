"use client";

import Image from "next/image";
import { ProductInfo } from "./UploadMenu";

type ShowProductDemoProps = {
  productInfo: ProductInfo;
};

export default function ShowProductDemo({ productInfo }: ShowProductDemoProps) {
  return (
    <div className="flex items-center justify-center bg-lad-pink rounded-md mt-4 py-6">
      <div>
        {productInfo.image ? (
          <Image
            src={URL.createObjectURL(productInfo.image)}
            alt="Product Image"
            width={64}
            height={64}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-[70px] h-[70px] bg-lad-gray"></div>
        )}
      </div>
      <div className="flex flex-col w-1/2 justify-center h-[100%] ml-6">
        <p className="font-bold">{productInfo.name}</p>
        <p className="break-all">{productInfo.description}</p>
      </div>
      <p className="font-semibold">
        {Number(productInfo.price) > 0 ? `${productInfo.price} TL` : ""}
      </p>
    </div>
  );
}
