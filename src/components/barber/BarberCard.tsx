import Link from "next/link";

type BarberCardProps = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
};

export default function BarberCard({
  id,
  name,
  rating,
  reviewCount,
}: BarberCardProps) {
  return (
    <article>
      <div className="flex aspect-[4/3.5] items-center justify-center rounded-2xl bg-[#e7e4dc]">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-24 w-24 text-[#aaa79f]"
    aria-hidden="true"
  >
    <path
      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
      fill="currentColor"
    />
    <path
      d="M3.5 22C3.5 17.3056 7.30558 13.5 12 13.5C16.6944 13.5 20.5 17.3056 20.5 22H3.5Z"
      fill="currentColor"
    />
  </svg>
</div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold">{name}</h3>

          <span className="shrink-0 text-sm font-medium">
            ★ {rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted">
          {reviewCount} reviews
        </p>

        <Link
          href={`/barbers/${id}`}
          className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-opacity hover:opacity-70"
        >
          View Profile →
        </Link>
      </div>
    </article>
  );
}