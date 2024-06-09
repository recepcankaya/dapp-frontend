export type Product = {
  name: string;
  price: string;
  description: string;
  image: string;
  id: string;
};

export type CategoryProduct = {
  category: string;
  categoryID: string;
  products: Product[];
};
