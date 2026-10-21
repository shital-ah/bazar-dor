
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setMessage(result.error.message || "Signup failed.");
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Signup error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unknown signup error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignup(provider: "google" | "github") {
    setMessage("");
    setSocialLoading(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        setMessage(result.error.message || `${provider} signup failed.`);
        setSocialLoading("");
      }
    } catch (error) {
      console.error("Social signup error:", error);
      setMessage(`${provider} signup failed. Please try again.`);
      setSocialLoading("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Create Account
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Join BazarDor today!
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialSignup("google")}
            disabled={!!socialLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <span className="text-lg font-bold text-blue-600">G</span>
            {socialLoading === "google"
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignup("github")}
            disabled={!!socialLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62 0-1.01.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.65 10.65 0 0 1 5.57 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.28-2.61 5.23-5.1 5.51.4.34.75 1.02.75 2.06v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
            {socialLoading === "github"
              ? "Connecting to GitHub..."
              : "Continue with GitHub"}
          </button>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          {message && (
            <p role="status" className="text-sm text-blue-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-green-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
