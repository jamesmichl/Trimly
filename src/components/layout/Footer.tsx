import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-[0.18em] text-foreground"
            >
              TRIMLY
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
              Simple appointments. Your barber, your time.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/services"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Services
            </Link>

            <Link
              href="/barbers"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Barbers
            </Link>

            <Link
              href="/book"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Book Appointment
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted">
            © 2026 Trimly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}