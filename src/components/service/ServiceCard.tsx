type ServiceCardProps = {
  name: string;
  description: string;
  price: string;
};

export default function ServiceCard({
  name,
  description,
  price,
}: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col border-t border-border py-8">
      <div className="flex items-start justify-between gap-6">
        <h3 className="text-xl font-semibold">{name}</h3>

        <span className="shrink-0 text-sm font-semibold text-primary">
          {price}
        </span>
      </div>

      <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
        {description}
      </p>

      <div className="mt-auto pt-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Select Service
        </span>
      </div>
    </article>
  );
}