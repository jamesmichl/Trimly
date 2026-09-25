import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link
          href="/"
          className="text-xl font-semibold tracking-[0.18em] text-foreground"
        >
          TRIMLY
        </Link>

        <div className="hidden items-center gap-8 md:flex">
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
            href="/bookings"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            My Bookings
          </Link>
        </div>

        <Link
          href="/book"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Book Now
        </Link>
      </nav>
    </header>
  );
}