
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Suspense } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  unit: string;
  today: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type Category = {
  slug: string;
  nameBn: string;
  icon?: string;
};

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor";

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function CategoryContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      setLoading(true);
      setNotFound(false);

      try {
        const [productResponse, categoryResponse] =
          await Promise.all([
            fetch(`${API_URL}/products?category=${encodeURIComponent(slug)}`),
            fetch(`${API_URL}/categories/${encodeURIComponent(slug)}`),
          ]);

        if (!productResponse.ok || !categoryResponse.ok) {
          if (!cancelled) setNotFound(true);
          return;
        }

        const productResult = await productResponse.json();
        const categoryResult = await categoryResponse.json();

        const productData = Array.isArray(productResult)
          ? productResult
          : productResult.data ?? productResult.products ?? [];

        const categoryData = categoryResult.data ?? categoryResult;

        if (!cancelled) {
          setProducts(productData);
          setCategory(categoryData);

          if (!categoryData?.slug && !categoryData?.nameBn) {
            setNotFound(true);
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") return a.today - b.today;
    if (sort === "high") return b.today - a.today;
    return 0;
  });

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-12">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </main>
    );
  }

  if (notFound || !category) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-5 text-2xl font-bold">
          ক্যাটাগরি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-gray-500">
          সঠিক ক্যাটাগরি নির্বাচন করে আবার চেষ্টা করো।
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-green-700">বাজার দর / ক্যাটাগরি</p>
          <h1 className="mt-2 text-3xl font-extrabold">
            {category.icon ?? "🛒"} {category.nameBn}
          </h1>
          <p className="mt-2 text-gray-500">
            মোট {bnNumber(products.length)}টি পণ্য
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <span className="shrink-0 font-semibold">সাজান:</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 outline-none focus:border-green-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => {
            const direction = product.change?.dir;
            const badge =
              direction === "up"
                ? "bg-green-100 text-green-700"
                : direction === "down"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600";

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-green-400 hover:shadow-lg"
              >
                <div className="flex h-20 items-center justify-center rounded-xl bg-green-50 text-5xl">
                  🛒
                </div>
                <h2 className="mt-4 text-lg font-bold">
                  {product.nameBn}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  প্রতি {product.unit}
                </p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500">আজকের দাম</p>
                    <p className="text-xl font-bold text-green-700">
                      ৳ {bnNumber(product.today)}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${badge}`}>
                    {direction === "up"
                      ? "▲"
                      : direction === "down"
                        ? "▼"
                        : "—"}{" "}
                    {bnNumber(product.change?.pct ?? 0)}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-bold">এই ক্যাটাগরিতে কোনো পণ্য নেই</p>
          <Link href="/" className="mt-4 inline-block text-green-700 underline">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-10">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </main>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}