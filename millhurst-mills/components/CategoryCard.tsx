import Link from "next/link";

interface CategoryCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  tag?: string;
}

export default function CategoryCard({ href, title, description, icon, tag }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-100 hover:border-[#1B3A2D]/20 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-7">
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{icon}</span>
          {tag && (
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#1B3A2D]/10 text-[#1B3A2D] px-2 py-1">
              {tag}
            </span>
          )}
        </div>
        <h3
          className="text-lg font-bold text-[#1B3A2D] mb-2 group-hover:text-[#B5783A] transition-colors"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
        </h3>
        <p className="text-[#6B6560] text-sm leading-relaxed">{description}</p>
        <div className="mt-5 flex items-center text-[#B5783A] text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
          Explore
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
