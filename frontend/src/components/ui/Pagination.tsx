import clsx from "clsx";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center gap-1.5" aria-label="Pagination">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
            p === page
              ? "bg-primary-900 text-white"
              : "text-neutral-500 hover:bg-neutral-100"
          )}
        >
          {p}
        </button>
      ))}
    </nav>
  );
}
