
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  id?: string;
  slug: string;
  nameBn: string;
  icon?: string;
};

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor";

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date())
    );

    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) return;

        const result = await response.json();
        const data = Array.isArray(result)
          ? result
          : result.data ?? result.categories ?? [];

        setCategories(data);
      } catch (error) {
        console.error("Category loading failed:", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <span className="text-2xl font-extrabold text-green-700">
            🛒 বাজার দর
          </span>
          <span className="mt-1 block text-xs text-gray-500">
            {date || "আজকের বাজারদর"}
          </span>
        </Link>

        <div className="flex gap-2">
          <Link
            href="/signin"
            className="rounded-lg border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      <nav className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          <Link
            href="/"
            className="shrink-0 rounded-lg bg-green-100 px-3 py-2 text-sm font-bold text-green-800"
          >
            🏠 হোম
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="shrink-0 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-green-50 hover:text-green-700"
            >
              {category.icon ? `${category.icon} ` : ""}
              {category.nameBn}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
