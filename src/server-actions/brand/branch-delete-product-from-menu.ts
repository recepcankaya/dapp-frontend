"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";

const PINATA_JWT = process.env.PINATA_JWT;

export type FormState = {
  success: unknown;
  message: string;
};

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

export default async function deleteProductFromMenu(
  prevState: any,
  formData: FormData
) {
  try {
    const userID = await getUserID();
    const productID = formData.get("productID");

    const supabase = createClient();

    const { data } = await supabase
      .from("brand_branch")
      .select("menu")
      .eq("id", userID)
      .single();

    if (!data?.menu) {
      return {
        success: false,
        message: "Menü bulunamadı.",
      };
    }

    const findProduct: Product | undefined = (data.menu as CategoryProduct[])
      .flatMap((category: CategoryProduct) => category.products)
      .find((product: Product) => Number(product.id) === Number(productID));
    const productIPFSHash = findProduct?.image.slice(21);

    await fetch(`https://api.pinata.cloud/pinning/unpin/${productIPFSHash}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    const { error } = await supabase.rpc("delete_product_from_menu", {
      p_brand_branch_id: userID,
      p_product_id: Number(productID),
    });

    if (error) {
      return {
        success: false,
        message: "Ürün silinirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      };
    } else {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return { success: true, message: "Ürün başarıyla silindi." };
    }
  } catch (error) {}
}
