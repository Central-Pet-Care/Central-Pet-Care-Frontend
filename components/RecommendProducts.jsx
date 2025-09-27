import { useEffect, useState } from "react";
import ProductCard from "./productCard";


// 👉 Later API eken ganna puluwan
const recommendedProducts = [
  {
    productId: "PROD001",
    name: "Whiskas Cat Food",
    price: 1500,
    images: ["https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ProductsPage/recomend-product.webp"],
  },
  {
    productId: "PROD002",
    name: "Dog Chew Toy",
    price: 950,
    images: ["https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ProductsPage/toy02.jpg"],
  },
  {
    productId: "PROD003",
    name: "Pet Medicine - Vitamin Boost",
    price: 2200,
    images: ["https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ProductsPage/medi02.png"],
  },
  {
    productId: "PROD004",
    name: "Pet Collar",
    price: 800,
    images: ["https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ProductsPage/a-01.jpg"],
  },
];

export default function RecommendedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(recommendedProducts);
  }, []);

  return (
    <section className="mt-12 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-violet-900">
        Recommended Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
}
