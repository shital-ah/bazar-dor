
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-green-100 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Link href="/" className="text-2xl font-extrabold text-green-700">
            🛒 বাজার দর
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600">
            বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর সহজেই জানুন।
            সচেতন থাকুন, সঠিক দামে কেনাকাটা করুন।
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900">দ্রুত লিংক</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-green-700">
                হোম
              </Link>
            </li>
            <li>
              <Link href="/#সব-পণ্য" className="hover:text-green-700">
                সব পণ্য
              </Link>
            </li>
            <li>
              <Link href="/signin" className="hover:text-green-700">
                সাইন ইন
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-green-700">
                সাইন আপ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-gray-900">আমাদের লক্ষ্য</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            বাজারদরের তথ্য সহজভাবে উপস্থাপন করে ক্রেতাদের সচেতন সিদ্ধান্ত
            নিতে সহায়তা করা।
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-center text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © 2026 BazarDor. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p>বাংলাদেশের বাজারদর, এক নজরে। 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}
