

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
    }
  }, [session?.user]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  async function handleUpdateName(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("নাম লিখো।");
      return;
    }

    try {
      setSaving(true);

      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        setMessage(result.error.message || "নাম আপডেট করা যায়নি।");
        return;
      }

      setMessage("তোমার নাম সফলভাবে আপডেট হয়েছে!");
    } catch (error) {
      console.error("Profile update failed:", error);
      setMessage("আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    try {
      setSigningOut(true);

      const result = await authClient.signOut();

      if (result.error) {
        setMessage(result.error.message || "Logout করা যায়নি।");
        return;
      }

      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Profile logout failed:", error);
      setMessage("Logout করতে সমস্যা হয়েছে।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  const user = session.user;
  const avatarLetter = (user.name || user.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-green-700">
        আমার প্রোফাইল
      </h1>

      <p className="mt-2 text-gray-600">
        তোমার ব্যক্তিগত তথ্য এখানে দেখো ও আপডেট করো।
      </p>

      <section className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 sm:flex-row">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800">
            {avatarLetter}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">
              {user.name || "ব্যবহারকারী"}
            </h2>
            <p className="mt-1 break-all text-gray-600">
              {user.email}
            </p>
            <p className="mt-2 text-sm text-green-700">
              BazarDor সদস্য
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-semibold text-black
              "
            >
              তোমার নাম
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="তোমার নাম লিখো"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email এখানে পরিবর্তন করা যাবে না।
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "আপডেট হচ্ছে..." : "নাম আপডেট করো"}
          </button>

          {message && (
            <p
              role="status"
              className="text-sm font-medium text-green-700"
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-lg border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {signingOut ? "Logout হচ্ছে..." : "লগ আউট"}
          </button>
        </div>
      </section>
    </main>
  );
}

