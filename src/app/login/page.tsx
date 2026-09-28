"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Unable to sign in.");
      setIsLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Trimly Account
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted">
            Sign in to manage your appointments.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-2xl border border-border bg-surface p-8"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
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
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Create account
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}