
"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor";

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) return;

        const result = await response.json();
        const data = Array.isArray(result)
          ? result
          : result.data ?? result.products ?? [];

        setProducts(data);
      } catch (error) {
        console.error("Price ticker loading failed:", error);
      }
    }

    loadProducts();
  }, []);

  if (products.length === 0) return null;

  const items = [...products, ...products];

  return (
    <div
      className="overflow-hidden border-b border-green-100 bg-green-50"
      aria-label="আজকের বাজারদরের চলমান তালিকা"
    >
      <div className="ticker-track flex w-max items-center gap-8 py-3">
        {items.map((product, index) => {
          const direction = product.change?.dir;
          const color =
            direction === "up"
              ? "text-green-700"
              : direction === "down"
                ? "text-red-600"
                : "text-gray-500";

          const arrow =
            direction === "up"
              ? "▲"
              : direction === "down"
                ? "▼"
                : "—";

          return (
            <div
              key={`${product.id}-${index}`}
              className="flex shrink-0 items-center gap-2 text-sm"
            >
              <span>🛒</span>
              <span className="font-semibold text-gray-800">
                {product.nameBn}
              </span>
              <span className="text-gray-500">
                ৳ {bnNumber(product.today)} / {product.unit}
              </span>
              <span className={`font-bold ${color}`}>
                {arrow} {bnNumber(product.change?.pct ?? 0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
