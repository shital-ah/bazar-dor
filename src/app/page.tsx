
import Link from "next/link";

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn?: string;
  unit: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const result = await response.json();

    // API response may wrap the product array.
    const products = Array.isArray(result)
      ? result
      : result.data ?? result.products ?? [];

    return products;
  } catch {
    return [];
  }
}

function taka(amount: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(amount);
}

function ProductCard({ product }: { product: Product }) {
  const icons: Record<string, string> = {
    chal: "🍚",
    dal: "🫘",
    tel: "🫙",
    alu: "🥔",
    peyaj: "🧅",
    morich: "🌶️",
    mach: "🐟",
    dim: "🥚",
  };

  const icon = icons[product.slug] ?? "🛒";

  const badgeColor =
    product.change?.dir === "up"
      ? "bg-green-100 text-green-700"
      : product.change?.dir === "down"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600";

  const arrow =
    product.change?.dir === "up"
      ? "▲"
      : product.change?.dir === "down"
        ? "▼"
        : "—";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:border-green-400 hover:shadow-lg"
    >
      <div className="flex h-20 items-center justify-center rounded-xl bg-green-50 text-5xl">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-800">
        {product.nameBn}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        প্রতি {product.unit}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-xl font-bold text-green-700">
            ৳ {taka(product.today)}
          </p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeColor}`}
        >
          {arrow} {taka(product.change?.pct ?? 0)}%
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  const risers = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
            বাংলাদেশের দৈনিক বাজারদর
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
            বাজারের দাম জানুন,
            <span className="block text-green-700">
              সাশ্রয়ী কেনাকাটা করুন
            </span>
          </h1>

          <p className="mt-5 max-w-lg leading-8 text-gray-600">
            চাল, ডাল, তেল, মাছ, সবজি ও নিত্যপ্রয়োজনীয় পণ্যের
            বাজারদর এক জায়গায় দেখুন।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-7 inline-block rounded-xl bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
          >
            সব পণ্যের দাম দেখুন ↓
          </a>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-3xl bg-green-100 p-8">
          <div className="text-center">
            <div className="text-8xl">🛒</div>
            <p className="mt-4 text-xl font-bold text-green-900">
              আজকের বাজারদর
            </p>
            <p className="mt-2 text-sm text-green-800">
              সঠিক সিদ্ধান্ত, সাশ্রয়ী বাজার
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-green-100 bg-white py-5">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-bold text-green-800">
            📊 আজকের বাজারদর — {products.length}টি পণ্য
          </p>
        </div>
      </section>

      {[
        {
          title: "আজ দাম বেড়েছে ▲",
          subtitle: "যেসব পণ্যের দাম বৃদ্ধি পেয়েছে",
          items: risers,
        },
        {
          title: "আজ দাম কমেছে ▼",
          subtitle: "যেসব পণ্যের দাম কমেছে",
          items: fallers,
        },
      ].map((section) => (
        <section
          key={section.title}
          className="mx-auto max-w-6xl px-4 py-10"
        >
          <h2 className="text-2xl font-extrabold">
            {section.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {section.subtitle}
          </p>

          {section.items.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-white p-5 text-gray-500">
              এই মুহূর্তে কোনো তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>
      ))}

      <section
        id="সব-পণ্য"
        className="mx-auto max-w-6xl scroll-mt-8 px-4 py-10"
      >
        <h2 className="text-3xl font-extrabold">সব পণ্য</h2>
        <p className="mt-2 text-gray-500">
          নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এক নজরে দেখুন।
        </p>

        {products.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-lg font-bold">
              পণ্যের তথ্য লোড করা যায়নি
            </p>
            <p className="mt-2 text-sm text-gray-500">
              API সংযোগ পরীক্ষা করে পেজটি আবার রিফ্রেশ করো।
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
