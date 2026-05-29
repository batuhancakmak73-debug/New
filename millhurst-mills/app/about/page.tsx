import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/business-info";

export const metadata: Metadata = {
  title: "About Millhurst Mills | Family-Owned Since 1925 — Manalapan, NJ",
  description:
    "Learn about Millhurst Mills — a family-owned lumber yard and hardware store in Manalapan, NJ since 1925. Authorized Ace Hardware dealer and Benjamin Moore retailer serving Monmouth County.",
  alternates: { canonical: "/about" },
};

const milestones = [
  { year: "1925", title: "Founded in Manalapan", desc: "Millhurst Mills opens its doors, serving the local community with lumber and building supplies." },
  { year: "1950s", title: "Expanding the Lumber Yard", desc: "Growing demand leads to significant expansion of the lumber yard and product inventory." },
  { year: "1970s", title: "Ace Hardware Partnership", desc: "Millhurst Mills becomes an authorized Ace Hardware dealer, expanding the hardware department." },
  { year: "1990s", title: "Benjamin Moore Paint Center", desc: "Addition of the Benjamin Moore paint center, offering premium paints and expert color consultation." },
  { year: "2000s", title: "Decking & Outdoor Living", desc: "New showrooms for composite decking, railings, grills, and outdoor living products." },
  { year: "Today", title: "100+ Years & Still Growing", desc: "Serving the third generation of Manalapan families with the same commitment to quality and service." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Millhurst Mills"
        subtitle="A century of serving Manalapan and Monmouth County with quality building materials, expert advice, and honest service."
        breadcrumb="Our Story"
      />

      {/* Main About */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="section-heading mb-6">
                Manalapan&rsquo;s Hardware & Lumber Store Since 1925
              </h2>
              <div className="space-y-5 text-[#6B6560] leading-relaxed">
                <p>
                  Millhurst Mills has been a cornerstone of Manalapan and the greater
                  Monmouth County community for over 100 years. What began as a local lumber
                  supplier has grown into a full-service building materials destination —
                  but we&rsquo;ve never lost sight of what matters most: knowing our
                  customers by name and giving them exactly what they need.
                </p>
                <p>
                  Today, Millhurst Mills is proud to be an authorized{" "}
                  <strong className="text-[#1A1A1A]">Ace Hardware dealer</strong> and an
                  authorized{" "}
                  <strong className="text-[#1A1A1A]">Benjamin Moore paint retailer</strong>.
                  Our store features a full lumber yard, a complete hardware department, a
                  paint center, and showrooms for decking, grills, doors, and windows.
                </p>
                <p>
                  Whether you&rsquo;re a weekend DIYer tackling your first project or a
                  professional contractor running multiple job sites, we have the inventory,
                  the expertise, and the service to support you. Our staff isn&rsquo;t
                  trained to upsell — they&rsquo;re trained to solve problems.
                </p>
                <p>
                  We believe in doing business the right way: treating every customer like
                  a neighbor, because most of you are. We are proud to be part of the
                  Manalapan community and to serve the contractors, builders, and homeowners
                  who keep our area growing.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-primary">
                  Visit Us Today
                </Link>
                <Link href="/contractor-services" className="btn-secondary">
                  Contractor Services
                </Link>
              </div>
            </div>

            {/* Values */}
            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-[#1B3A2D]" style={{ fontFamily: "Georgia, serif" }}>
                Why Manalapan Trusts Millhurst Mills
              </h3>
              {[
                {
                  icon: "🏠",
                  title: "Local & Family-Owned",
                  desc: "Over 100 years serving Manalapan and Monmouth County — not a chain, not a franchise. A real local business.",
                },
                {
                  icon: "🔧",
                  title: "Ace Hardware Dealer",
                  desc: "National brand products with local, personal service and a staff that actually knows hardware.",
                },
                {
                  icon: "🎨",
                  title: "Benjamin Moore Retailer",
                  desc: "Authorized retailer with expert color matching, premium paints, and in-store consultation.",
                },
                {
                  icon: "🌲",
                  title: "Full Lumber Yard",
                  desc: "Dimensional lumber, pressure treated, plywood, and specialty wood all in stock and ready to go.",
                },
                {
                  icon: "👷",
                  title: "Contractor Accounts",
                  desc: "Open accounts, bulk pricing, net terms, and a dedicated team that understands contractor needs.",
                },
                {
                  icon: "🚛",
                  title: "Delivery Available",
                  desc: "We deliver lumber and building materials to job sites throughout Monmouth County.",
                },
                {
                  icon: "💬",
                  title: "Expert Staff",
                  desc: "Knowledgeable team who can answer real questions and help you pick the right products.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <span className="text-2xl flex-shrink-0 mt-1">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-[#1B3A2D] mb-1">{item.title}</h4>
                    <p className="text-[#6B6560] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#F8F5F0]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="section-heading">Our History</h2>
            <p className="section-subheading mx-auto">
              Over 100 years of growth, service, and community.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#1B3A2D]/20 md:-translate-x-0.5" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start`}
                >
                  <div className="flex-1 md:w-1/2 pl-12 md:pl-0">
                    <div
                      className={`bg-white p-6 shadow-card border-l-4 border-[#1B3A2D] ${i % 2 === 0 ? "md:mr-8 md:border-l-0 md:border-r-4" : "md:ml-8"}`}
                    >
                      <p className="text-[#B5783A] font-bold text-lg mb-1">{m.year}</p>
                      <h3 className="font-bold text-[#1B3A2D] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                        {m.title}
                      </h3>
                      <p className="text-[#6B6560] text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 bg-[#1B3A2D] rounded-full border-4 border-white flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#B5783A] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1B3A2D] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Come See Us in Manalapan
          </h2>
          <p className="text-white/70 text-lg mb-8">
            {BUSINESS.address.full} · {BUSINESS.phone}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={BUSINESS.phoneHref} className="btn-amber">
              ☎ Call Us
            </a>
            <Link href="/contact" className="btn-white">
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
