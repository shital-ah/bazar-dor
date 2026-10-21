

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category?: string;
  categoryNameBn?: string;
  unit: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type MarketPrice = {
  marketNameBn?: string;
  marketName?: string;
  nameBn?: string;
  name?: string;
  price?: number;
  today?: number;
  priceToday?: number;
  [key: string]: unknown;
};

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function unwrapList(result: unknown): unknown[] {
  if (Array.isArray(result)) return result;
  if (!isRecord(result)) return [];

  const data = result.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(result.products)) return result.products;

  if (isRecord(data) && Array.isArray(data.products)) {
    return data.products;
  }

  return [];
}

function unwrapProduct(result: unknown): ApiRecord {
  if (!isRecord(result)) return {};

  const data = result.data;

  if (isRecord(data)) {
    if (isRecord(data.product)) return data.product;
    return data;
  }

  if (isRecord(result.product)) return result.product;

  return result;
}

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

async function getProduct(
  slug: string
): Promise<{
  product: Product;
  markets: MarketPrice[];
} | null> {
  try {
    const listResponse = await fetch(`${API_URL}/products`, {
      cache: "no-store",
    });

    if (!listResponse.ok) return null;

    const listResult: unknown = await listResponse.json();
    const products = unwrapList(listResult) as Product[];

    const matchedProduct = products.find(
      (item) => item.slug === slug
    );

    if (!matchedProduct) return null;

    const detailResponse = await fetch(
      `${API_URL}/products/${matchedProduct.id}`,
      { cache: "no-store" }
    );

    if (!detailResponse.ok) {
      return { product: matchedProduct, markets: [] };
    }

    const detailResult: unknown = await detailResponse.json();
    const detail = unwrapProduct(detailResult);

    const product: Product = {
      ...matchedProduct,
      ...detail,
    } as Product;

    const detailResultRecord = isRecord(detailResult)
      ? detailResult
      : {};

    const detailResultData = isRecord(detailResultRecord.data)
      ? detailResultRecord.data
      : {};

    const possibleMarkets =
      detail.marketPrices ??
      detail.market_prices ??
      detail.pricesByMarket ??
      detail.markets ??
      detailResultRecord.marketPrices ??
      detailResultData.marketPrices;

    return {
      product,
      markets: Array.isArray(possibleMarkets)
        ? (possibleMarkets as MarketPrice[])
        : [],
    };
  } catch (error) {
    console.error("Product loading failed:", error);
    return null;
  }
}

async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Protect this page using the server-side Better Auth session.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const { slug } = await params;
  const result = await getProduct(slug);

  if (!result) notFound();

  const { product, markets } = result;

  const priceValues = markets
    .map((market) =>
      Number(
        market.price ?? market.today ?? market.priceToday
      )
    )
    .filter((price) => Number.isFinite(price) && price > 0);

  const minimum =
    priceValues.length > 0 ? Math.min(...priceValues) : null;

  const maximum =
    priceValues.length > 0 ? Math.max(...priceValues) : null;

  const average =
    priceValues.length > 0
      ? priceValues.reduce((sum, price) => sum + price, 0) /
        priceValues.length
      : null;

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          ← হোম পেজে ফিরে যাও
        </Link>

        <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-7xl">
              🛒
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-green-700">
                {product.categoryNameBn ?? "নিত্যপ্রয়োজনীয় পণ্য"}
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
                {product.nameBn}
              </h1>

              <p className="mt-2 text-gray-500">
                একক: প্রতি {product.unit}
              </p>

              <p className="mt-5 text-sm text-gray-500">
                আজকের বাজারদর
              </p>

              <p className="text-3xl font-extrabold text-green-700">
                ৳ {bnNumber(Number(product.today) || 0)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  isUp
                    ? "bg-red-50 text-red-700"
                    : isDown
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {isUp
                  ? "▲ দাম বেড়েছে"
                  : isDown
                    ? "▼ দাম কমেছে"
                    : "— দাম অপরিবর্তিত"}{" "}
                {bnNumber(Number(product.change?.pct) || 0)}%
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "সর্বনিম্ন দাম",
                value: minimum,
                color: "text-green-700",
              },
              {
                label: "সর্বোচ্চ দাম",
                value: maximum,
                color: "text-red-600",
              },
              {
                label: "গড় দাম",
                value: average,
                color: "text-blue-700",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                  {item.value === null
                    ? "তথ্য নেই"
                    : `৳ ${bnNumber(item.value)}`}
                </p>
              </div>
            ))}
          </div>

          {priceValues.length === 0 && (
            <p className="mt-3 text-sm text-gray-500">
              বিভিন্ন বাজারের দাম পাওয়া গেলে এখানে সর্বনিম্ন,
              সর্বোচ্চ ও গড় দাম দেখানো হবে।
            </p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            বিভিন্ন বাজারের দাম
          </h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {markets.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {markets.map((market, index) => {
                  const marketName =
                    market.marketNameBn ??
                    market.marketName ??
                    market.nameBn ??
                    market.name ??
                    `বাজার ${index + 1}`;

                  const price = Number(
                    market.price ??
                      market.today ??
                      market.priceToday
                  );

                  return (
                    <div
                      key={`${String(marketName)}-${index}`}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <span className="font-medium text-gray-800">
                        📍 {String(marketName)}
                      </span>

                      <span className="font-bold text-green-700">
                        {Number.isFinite(price) && price > 0
                          ? `৳ ${bnNumber(price)}`
                          : "দাম পাওয়া যায়নি"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="p-6 text-gray-500">
                এই পণ্যের বাজারভিত্তিক দামের তথ্য এখন পাওয়া যাচ্ছে না।
              </p>
            )}
          </div>
        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            সব পণ্য দেখুন
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-gray-100" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </main>
      }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}
