// src/data/products.ts
import type { Product } from "@/types/Product";

export const products: Product[] = [
  {
    id: "prod_1",
    name: "Whitehawk FC Home Shirt 2026/27",
    price: 49.99,
    category: "shirts",
    image: "/src/assets/shop/shop_home_shirt.jpg",
    description: "The official 2026/27 home shirt, featuring the traditional club red with custom gold detailing. High-breathability premium fabric.",
    badge: "New Arrival",
    stripeMockUrl: "https://checkout.stripe.com/c/pay/cs_live_mock_home_shirt",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 },
    ],
  },
  {
    id: "prod_2",
    name: "Whitehawk FC Away Shirt 2026/27",
    price: 49.99,
    category: "shirts",
    image: "/src/assets/shop/shop_away_shirt.jpg",
    description: "The official away shirt, showcasing a clean white and red design. Made from 100% recycled performance fibers.",
    badge: "Popular",
    stripeMockUrl: "https://checkout.stripe.com/c/pay/cs_live_mock_away_shirt",
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 14 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 5 },
    ],
  },
  // Additional products can be added here
];
