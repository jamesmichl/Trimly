"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const { error } = await authClient.signUp.email({
      name,
      email,
      phoneNumber,
      password,
    });

    if (error) {
      setError(error.message ?? "Unable to create account.");
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
            Create your account
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted">
            Create an account to book and manage your appointments.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-2xl border border-border bg-surface p-8"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>

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
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>

              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                required
                autoComplete="tel"
                placeholder="+62 812 3456 7890"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />

              <p className="mt-2 text-xs text-muted">
                Used by the barbershop to contact you about your appointment.
              </p>
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
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />

              <p className="mt-2 text-xs text-muted">
                Use at least 8 characters.
              </p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}