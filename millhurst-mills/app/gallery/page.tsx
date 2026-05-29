import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { BUSINESS } from "@/lib/business-info";

export const metadata: Metadata = {
  title: "Photo Gallery | Millhurst Mills — Manalapan, NJ Store & Lumber Yard",
  description:
    "Photo gallery of Millhurst Mills in Manalapan, NJ. See our lumber yard, hardware store, paint center, and more. Family-owned since 1925.",
  alternates: { canonical: "/gallery" },
};

const galleryCategories = [
  { label: "Store Exterior & Storefront", emoji: "🏪", desc: "Our Route 9 location in Manalapan, NJ" },
  { label: "Lumber Yard", emoji: "🌲", desc: "Full-service lumber yard with in-stock inventory" },
  { label: "Hardware Department", emoji: "🔧", desc: "Ace Hardware products and hardware essentials" },
  { label: "Benjamin Moore Paint Center", emoji: "🎨", desc: "Paint center with full color selection" },
  { label: "Decking & Outdoor Living", emoji: "🏡", desc: "Composite decking, grills, and outdoor products" },
  { label: "Interior Store", emoji: "🏬", desc: "Product displays and store interior" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Photo Gallery"
        subtitle="Take a look at Millhurst Mills — our store, lumber yard, departments, and the products we carry in Manalapan, NJ."
        breadcrumb="Gallery"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Our Store & Departments</h2>
            <p className="section-subheading mx-auto">
              Millhurst Mills has been a Manalapan landmark since 1925. Browse our gallery to see our full-service lumber yard, hardware department, paint center, and more.
            </p>
          </div>

          {/* Gallery categories — placeholder grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {galleryCategories.map((cat) => (
              <div
                key={cat.label}
                className="group relative overflow-hidden bg-gradient-to-br from-[#1B3A2D] to-[#2D5A3D] aspect-[4/3] flex flex-col items-center justify-center text-center p-8"
              >
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                <h3
                  className="text-white font-bold text-xl mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {cat.label}
                </h3>
                <p className="text-white/60 text-sm">{cat.desc}</p>

                {/* Photo credit overlay */}
                <div className="absolute inset-0 bg-[#B5783A]/0 group-hover:bg-[#B5783A]/10 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Photo note */}
          <div className="bg-[#F8F5F0] border border-[#1B3A2D]/10 p-8 text-center max-w-3xl mx-auto">
            <p className="text-2xl mb-4">📸</p>
            <h3 className="text-xl font-bold text-[#1B3A2D] mb-3" style={{ fontFamily: "Georgia, serif" }}>
              High-Resolution Photos Coming Soon
            </h3>
            <p className="text-[#6B6560] leading-relaxed">
              We&rsquo;re updating our gallery with professional high-resolution photography
              of our store, lumber yard, and departments. In the meantime, come visit us at{" "}
              {BUSINESS.address.full} and see for yourself!
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BUSINESS.phoneHref} className="btn-primary">
                ☎ Call Us
              </a>
              <Link href="/contact" className="btn-secondary">
                Get Directions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Come visit CTA */}
      <section className="py-16 bg-[#1B3A2D] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
            The Best Way to See Millhurst Mills Is In Person
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Our lumber yard, hardware department, paint center, and outdoor living showroom are
            best experienced firsthand. Stop by — our staff will be happy to give you a tour
            and answer any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-amber">
              📍 Get Directions
            </Link>
            <a href={BUSINESS.phoneHref} className="btn-white">
              ☎ {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
