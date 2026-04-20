import CustomGiftsPage, { type GiftProduct } from "@/components/communityUsers/customGifts/CustomGiftsPage";

const products: GiftProduct[] = [
  {
    id: "organic-buckwheat-flour",
    name: "Organic Buckwheat Flour",
    description: "Premium stone-ground flour",
    image: "/product/product-1.webp",
    size: "500g",
    price: "$12",
  },
  {
    id: "buckwheat-oats",
    name: "Buckwheat Oats",
    description: "Whole grain nutrition",
    image: "/product/product-2.webp",
    size: "250g",
    price: "$8",
    selected: true,
    quantity: 1,
  },
  {
    id: "buckwheat-tea-blend",
    name: "Buckwheat Tea Blend",
    description: "Soothing wellness tea",
    image: "/product/product-3.webp",
    size: "100g",
    price: "$15",
  },
];

export default function CustomGiftsRoute() {
  return <CustomGiftsPage products={products} />;
}
