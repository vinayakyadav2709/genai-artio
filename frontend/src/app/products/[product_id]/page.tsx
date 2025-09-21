"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/Productdetails";

export default function ProductPage() {
  const { product_id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const found = data.products.find(
          (p: any) => p.product_id === product_id
        );
        setProduct(found || null);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (product_id) fetchProduct();
  }, [product_id]);

  if (loading) return <p className="text-white p-6">Loading product...</p>;
  if (!product) return <p className="text-white p-6">Product not found.</p>;

  return (
    <ProductDetails product={product} onBack={() => router.push("/products")} />
  );
}
