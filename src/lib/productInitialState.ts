export type ProductStatus = {
  success: unknown;
  message: string;
  product: Menus;
};

export const initialState: ProductStatus = {
  success: undefined,
  message: "",
  product: {
    branch_id: "",
    description: "",
    id: "",
    image_url: "",
    name: "",
    price: 0,
    position: 0,
    category: "",
  },
};
