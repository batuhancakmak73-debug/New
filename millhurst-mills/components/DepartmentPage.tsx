import Link from "next/link";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/business-info";

interface Product {
  name: string;
  desc?: string;
}

interface DepartmentPageProps {
  title: string;
  heroSubtitle: string;
  breadcrumb: string;
  intro: string;
  features: string[];
  products?: Product[];
  ctaHeading?: string;
  ctaText?: string;
  relatedLinks?: { href: string; label: string }[];
  brand?: { name: string; badge: string; desc: string };
}

export default function DepartmentPage({
  title,
  heroSubtitle,
  breadcrumb,
  intro,
  features,
  products,
  ctaHeading,
  ctaText,
  relatedLinks,
  brand,
}: DepartmentPageProps) {
  return (
    <>
      <PageHero title={title} subtitle={heroSubtitle} breadcrumb={breadcrumb} />

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Left: main content */}
            <div className="lg:col-span-2">
              {brand && (
                <div className="flex items-center gap-4 bg-[#F8F5F0] border border-[#1B3A2D]/10 p-5 mb-8">
                  <span className="text-4xl">{brand.badge}</span>
                  <div>
                    <p className="text-xs text-[#6B6560] uppercase tracking-widest font-semibold">
                      Authorized Dealer
                    </p>
                    <p className="font-bold text-[#1B3A2D] text-lg" style={{ fontFamily: "Georgia, serif" }}>
                      {brand.name}
                    </p>
                    <p className="text-[#6B6560] text-sm">{brand.desc}</p>
                  </div>
                </div>
              )}

              <p className="text-[#6B6560] text-lg leading-relaxed mb-10">{intro}</p>

              {products && products.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-[#1B3A2D] mb-6" style={{ fontFamily: "Georgia, serif" }}>
                    What We Carry
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div key={p.name} className="bg-[#F8F5F0] p-4 border-l-2 border-[#1B3A2D]">
                        <p className="font-semibold text-[#1B3A2D] text-sm">{p.name}</p>
                        {p.desc && <p className="text-[#6B6560] text-xs mt-1">{p.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-[#1B3A2D] mb-6" style={{ fontFamily: "Georgia, serif" }}>
                  Why Shop With Millhurst Mills
                </h2>
                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="text-[#B5783A] font-bold mt-0.5">✓</span>
                      <span className="text-[#6B6560] leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Contact card */}
              <div className="bg-[#1B3A2D] text-white p-6">
                <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  Visit or Call Us
                </h3>
                <address className="not-italic text-white/80 text-sm space-y-2 mb-5">
                  <p>{BUSINESS.address.full}</p>
                  <a href={BUSINESS.phoneHref} className="block text-[#B5783A] font-bold text-lg hover:text-[#D4944A]">
                    {BUSINESS.phone}
                  </a>
                </address>
                <div className="text-white/60 text-xs space-y-1 mb-5">
                  <p>{BUSINESS.hours.weekdays}</p>
                  <p>{BUSINESS.hours.saturday}</p>
                  <p>{BUSINESS.hours.sunday}</p>
                </div>
                <Link href="/contact" className="btn-amber w-full text-center">
                  Get Directions
                </Link>
              </div>

              {/* Related links */}
              {relatedLinks && (
                <div className="bg-[#F8F5F0] p-6 border border-gray-200">
                  <h3 className="font-bold text-[#1B3A2D] text-sm uppercase tracking-widest mb-4">
                    Related Departments
                  </h3>
                  <ul className="space-y-2">
                    {relatedLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-[#1B3A2D] hover:text-[#B5783A] text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          → {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contractor account */}
              <div className="bg-[#B5783A] text-white p-6">
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Contractor?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Open a contractor account for net terms, bulk pricing, and priority service.
                </p>
                <Link href="/contractor-services" className="btn-white w-full text-center text-xs">
                  Learn About Accounts
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#F8F5F0] border-t border-gray-200 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1B3A2D] mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {ctaHeading || "Ready to Get Started?"}
          </h2>
          <p className="text-[#6B6560] text-lg mb-8">
            {ctaText || `Visit Millhurst Mills at ${BUSINESS.address.full} or call ${BUSINESS.phone}.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={BUSINESS.phoneHref} className="btn-primary">
              ☎ {BUSINESS.phone}
            </a>
            <Link href="/contact" className="btn-secondary">
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
