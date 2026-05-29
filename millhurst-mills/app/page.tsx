import type { Metadata } from "next";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import TrustBadges from "@/components/TrustBadges";
import { BUSINESS } from "@/lib/business-info";

export const metadata: Metadata = {
  title: "Millhurst Mills | Lumber, Hardware & Building Materials — Manalapan, NJ",
  description:
    "Manalapan's local source for lumber, hardware, paint, decking & remodeling supplies. Authorized Ace Hardware dealer & Benjamin Moore retailer. Family-owned since 1925. Serving Monmouth County, NJ.",
  alternates: { canonical: "/" },
};

const categories = [
  {
    href: "/lumber",
    title: "Lumber & Plywood",
    description:
      "Dimensional lumber, pressure treated, plywood, OSB, and specialty wood products direct from our full-service lumber yard.",
    icon: "🌲",
  },
  {
    href: "/building-materials",
    title: "Building Materials",
    description:
      "Concrete, masonry, insulation, roofing, siding, and all the structural materials your project requires.",
    icon: "🧱",
  },
  {
    href: "/ace-hardware",
    title: "Ace Hardware",
    description:
      "Tools, fasteners, plumbing, electrical, outdoor supplies — the full Ace Hardware line at a local, friendly store.",
    icon: "🔧",
    tag: "AUTHORIZED",
  },
  {
    href: "/benjamin-moore-paint",
    title: "Benjamin Moore Paint",
    description:
      "Premium interior and exterior paints, stains, and finishes. Expert color matching and in-store consultations.",
    icon: "🎨",
    tag: "AUTHORIZED",
  },
  {
    href: "/decking-railing",
    title: "Decking & Railing",
    description:
      "Composite and pressure treated decking, railing systems, hardware, and everything to build your dream outdoor deck.",
    icon: "🏡",
  },
  {
    href: "/grills-outdoor-living",
    title: "Grills & Outdoor Living",
    description:
      "Top grill brands, outdoor furniture, fire pits, and everything to complete your outdoor living space.",
    icon: "🔥",
  },
  {
    href: "/doors-windows",
    title: "Doors & Windows",
    description:
      "Interior and exterior doors, windows, and special order options for every home improvement project.",
    icon: "🚪",
  },
  {
    href: "/tools-hardware",
    title: "Tools & Hardware",
    description:
      "Hand tools, power tools, fasteners, anchors, and the hardware essentials that every project demands.",
    icon: "🛠️",
  },
  {
    href: "/outlet-closeouts",
    title: "Outlet & Closeouts",
    description:
      "Discounted building materials, overstock items, and closeout deals — quality products at reduced prices.",
    icon: "🏷️",
    tag: "DEALS",
  },
];

const testimonials = [
  {
    quote:
      "Been coming here for 20 years. The staff knows their products and always points me in the right direction. Better than any big box store.",
    author: "Mike R.",
    location: "Manalapan, NJ",
  },
  {
    quote:
      "As a contractor, I rely on Millhurst Mills for quick, accurate lumber orders. Delivery is reliable and the pricing is fair. They get it.",
    author: "Steve C.",
    location: "Marlboro, NJ",
  },
  {
    quote:
      "Great local business. The Benjamin Moore paint center is excellent — they matched my color perfectly and the staff was incredibly helpful.",
    author: "Jennifer L.",
    location: "Freehold, NJ",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0F2419 0%, #1B3A2D 40%, #2D5A3D 70%, #1B3A2D 100%)",
          }}
        />
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #B5783A, transparent)" }}
          />
          <div
            className="absolute -bottom-32 -left-20 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #3D7A52, transparent)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, #B5783A 0px, #B5783A 1px, transparent 1px, transparent 80px),
                repeating-linear-gradient(90deg, #B5783A 0px, #B5783A 1px, transparent 1px, transparent 80px)`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 w-full py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#B5783A]/20 border border-[#B5783A]/40 text-[#D4944A] text-xs font-semibold tracking-widest uppercase px-4 py-2 mb-8">
              <span>Est. 1925</span>
              <span className="opacity-50">·</span>
              <span>Manalapan, NJ</span>
              <span className="opacity-50">·</span>
              <span>Monmouth County</span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Manalapan&rsquo;s Local Source for{" "}
              <span className="text-[#B5783A]">
                Lumber, Hardware &amp; Building Supplies
              </span>
            </h1>

            <p className="text-white/70 text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl">
              Family-owned since 1925. Authorized Ace Hardware dealer and Benjamin Moore
              paint retailer. Serving contractors and homeowners across Monmouth County.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link href="/contact" className="btn-amber text-base px-8 py-4">
                📍 Get Directions
              </Link>
              <a href={BUSINESS.phoneHref} className="btn-white text-base px-8 py-4">
                ☎ {BUSINESS.phone}
              </a>
              <Link
                href="/contractor-services"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-4 hover:border-white/60 transition-colors tracking-widest text-sm uppercase gap-2"
              >
                Contractor Accounts →
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: "100+", label: "Years in Business" },
                { value: "1000s", label: "Products In-Stock" },
                { value: "Free", label: "Contractor Accounts" },
                { value: "Same-Day", label: "Delivery Available" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-2xl font-bold text-[#B5783A]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-xs tracking-wide mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Welcome / About intro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#B5783A] text-xs uppercase tracking-widest font-semibold mb-4">
                About Millhurst Mills
              </p>
              <h2 className="section-heading mb-6">
                Your Neighborhood Hardware &amp; Lumber Store — For Over a Century
              </h2>
              <p className="text-[#6B6560] text-lg leading-relaxed mb-6">
                Since 1925, Millhurst Mills has been the go-to source for homeowners and
                contractors throughout Manalapan, Marlboro, Freehold, and all of Monmouth
                County. We&rsquo;re not a big-box store — we&rsquo;re your neighbors, and we
                know building.
              </p>
              <p className="text-[#6B6560] leading-relaxed mb-8">
                As an authorized Ace Hardware dealer and Benjamin Moore paint retailer, we
                combine the buying power of national brands with the personal service only a
                family-owned business can provide. Our full-service lumber yard, complete
                hardware department, and experienced team mean you get the right product
                and the right advice, every time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about" className="btn-primary">
                  Our Story →
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Visit the Store
                </Link>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "🏠",
                  title: "Family Owned",
                  desc: "Three generations of the same family, serving the same community.",
                },
                {
                  icon: "🌲",
                  title: "Full Lumber Yard",
                  desc: "Dimensional lumber, pressure treated, plywood — all in stock.",
                },
                {
                  icon: "🚛",
                  title: "Delivery Available",
                  desc: "We deliver to job sites across Monmouth County.",
                },
                {
                  icon: "👷",
                  title: "Contractor Friendly",
                  desc: "Open accounts, bulk pricing, and dedicated service.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-[#F8F5F0] p-6 border-l-4 border-[#1B3A2D]"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <h3
                    className="font-bold text-[#1B3A2D] mt-2 mb-1"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#6B6560] text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#B5783A] text-xs uppercase tracking-widest font-semibold mb-3">
              Everything You Need
            </p>
            <h2 className="section-heading">Shop Our Departments</h2>
            <p className="section-subheading mx-auto">
              From the lumber yard to the paint center — Millhurst Mills carries it all,
              in-stock and ready for pickup or delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.href} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Contractor CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B3A2D 0%, #2D5A3D 100%)" }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #B5783A 0px, #B5783A 1px, transparent 1px, transparent 20px)`,
            }}
            className="w-full h-full"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#B5783A] text-xs uppercase tracking-widest font-semibold mb-4">
            For Builders & Contractors
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            We Know What Contractors Need
          </h2>
          <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Open accounts, volume pricing, job-site delivery, and a team that understands
            your schedule. Millhurst Mills has been the contractor&rsquo;s choice in
            Monmouth County for over 100 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contractor-services" className="btn-amber text-base px-8 py-4">
              Open a Contractor Account
            </Link>
            <Link href="/delivery" className="btn-white text-base px-8 py-4">
              Delivery Information
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#B5783A] text-xs uppercase tracking-widest font-semibold mb-3">
              What Our Customers Say
            </p>
            <h2 className="section-heading">Trusted by Manalapan &amp; Monmouth County</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-[#F8F5F0] p-8 border-t-4 border-[#1B3A2D]">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#B5783A] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#1A1A1A] leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-[#1B3A2D] text-sm">{t.author}</p>
                  <p className="text-[#6B6560] text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Location CTA */}
      <section className="bg-[#F8F5F0] py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="text-4xl mb-3">📍</div>
              <h3
                className="font-bold text-[#1B3A2D] text-xl mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Find Us
              </h3>
              <p className="text-[#6B6560]">
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
              </p>
              <Link href="/contact" className="inline-block mt-4 text-[#B5783A] font-semibold text-sm hover:underline">
                Get Directions →
              </Link>
            </div>
            <div>
              <div className="text-4xl mb-3">🕐</div>
              <h3
                className="font-bold text-[#1B3A2D] text-xl mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Store Hours
              </h3>
              <div className="text-[#6B6560] space-y-1 text-sm">
                <p>{BUSINESS.hours.weekdays}</p>
                <p>{BUSINESS.hours.saturday}</p>
                <p>{BUSINESS.hours.sunday}</p>
              </div>
            </div>
            <div>
              <div className="text-4xl mb-3">☎</div>
              <h3
                className="font-bold text-[#1B3A2D] text-xl mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Call Us
              </h3>
              <a
                href={BUSINESS.phoneHref}
                className="text-[#1B3A2D] font-bold text-2xl hover:text-[#B5783A] transition-colors"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {BUSINESS.phone}
              </a>
              <p className="text-[#6B6560] text-sm mt-2">
                Mon–Fri 7AM–5:30PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
