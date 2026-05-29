interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  accent?: string;
}

export default function PageHero({ title, subtitle, breadcrumb, accent }: PageHeroProps) {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1B3A2D 0%, #2D5A3D 60%, #1B3A2D 100%)" }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #B5783A 0px, #B5783A 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(-45deg, #B5783A 0px, #B5783A 1px, transparent 1px, transparent 12px)`,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B5783A]/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4">
        {breadcrumb && (
          <p className="text-[#B5783A] text-xs uppercase tracking-widest font-semibold mb-4">
            {breadcrumb}
          </p>
        )}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
          {accent && <span className="text-[#B5783A]"> {accent}</span>}
        </h1>
        {subtitle && (
          <p className="mt-5 text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
