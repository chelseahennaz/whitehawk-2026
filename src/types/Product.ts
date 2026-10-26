export interface ProductSize {
  size: string; // e.g. "S", "M", "L", "XL"
  stock: number; // available quantity
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "shirts" | "hats-scarves" | "accessories";
  image: string;
  description: string;
  badge?: string;
  sizes: ProductSize[]; // new field for size & stock
  stripeMockUrl?: string;
}
