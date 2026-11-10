import Link from "next/link";

export default function SectionHeader({
  title,
  subtitle,
  seeAllHref,
}: {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#A3B1AC]">{subtitle}</p>
        )}
      </div>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          prefetch={false}
          className="text-xs font-semibold text-[#4CD964] hover:underline"
        >
          See all
        </Link>
      )}
    </div>
  );
}
