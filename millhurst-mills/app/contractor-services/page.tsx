import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/business-info";

export const metadata: Metadata = {
  title: "Contractor Services | Millhurst Mills — Lumber & Materials for Contractors, Manalapan NJ",
  description:
    "Contractor accounts, bulk pricing, job-site delivery, and professional service at Millhurst Mills in Manalapan, NJ. Serving Monmouth County contractors for over 100 years.",
  alternates: { canonical: "/contractor-services" },
};

export default function ContractorServicesPage() {
  return (
    <>
      <PageHero
        title="Contractor Services"
        subtitle="Open accounts, bulk pricing, reliable delivery, and a team that understands what contractors need — serving Monmouth County builders since 1925."
        breadcrumb="Services → Contractor Services"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h2 className="section-heading mb-6">We Know What Contractors Need</h2>
              <p className="text-[#6B6560] text-lg leading-relaxed mb-8">
                Millhurst Mills has been a trusted supplier for contractors, builders, and
                tradespeople in Monmouth County for over 100 years. We understand that your
                time on the job site is valuable, your budget is tight, and your materials
                need to be right. That&rsquo;s why we offer contractor accounts, bulk pricing,
                reliable delivery, and a team that speaks your language.
              </p>

              {/* Contractor benefits */}
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {[
                  {
                    icon: "📋",
                    title: "Open Contractor Accounts",
                    desc: "Apply for a net-terms account. Reduce job-site cash flow demands and track all your purchases in one place.",
                  },
                  {
                    icon: "💰",
                    title: "Volume & Bulk Pricing",
                    desc: "Volume discounts on lumber, fasteners, building materials, and hardware. Ask about pricing for your job size.",
                  },
                  {
                    icon: "🚛",
                    title: "Job-Site Delivery",
                    desc: "We deliver lumber and building materials to job sites throughout Monmouth County. Monday through Friday scheduling.",
                  },
                  {
                    icon: "🌲",
                    title: "Full Lumber Inventory",
                    desc: "Dimensional, pressure treated, plywood, and engineered lumber in-stock and ready to go. Accurate orders, every time.",
                  },
                  {
                    icon: "📦",
                    title: "Special Orders",
                    desc: "We can source materials we don't normally stock. Give us your spec and we'll find it.",
                  },
                  {
                    icon: "💬",
                    title: "Dedicated Service",
                    desc: "A team that understands contractor timelines and priorities. No explaining what you need twice.",
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-[#F8F5F0] p-6 border-l-4 border-[#1B3A2D]">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="font-bold text-[#1B3A2D] mt-3 mb-2" style={{ fontFamily: "Georgia, serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-[#6B6560] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* How to open */}
              <div className="bg-[#1B3A2D] text-white p-8 mb-10">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>
                  How to Open a Contractor Account
                </h2>
                <ol className="space-y-4">
                  {[
                    "Visit us in-store or call us at " + BUSINESS.phone + " to speak with our contractor account manager.",
                    "Bring your business license and two trade references.",
                    "Complete our simple credit application — approval is typically same-day or next-day.",
                    "Start purchasing on account immediately upon approval.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="w-7 h-7 bg-[#B5783A] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-white/80 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* What contractors buy */}
              <h2 className="text-2xl font-bold text-[#1B3A2D] mb-6" style={{ fontFamily: "Georgia, serif" }}>
                Products We Supply to Contractors
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  "Framing Lumber",
                  "Pressure Treated Lumber",
                  "Plywood & OSB",
                  "LVL Beams & Headers",
                  "Concrete & Masonry",
                  "Insulation",
                  "Drywall",
                  "Roofing Materials",
                  "Composite Decking",
                  "Fasteners & Anchors",
                  "Structural Hardware",
                  "Doors & Windows",
                  "Benjamin Moore Paint",
                  "Paint Supplies",
                  "Ace Hardware Products",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[#6B6560] bg-[#F8F5F0] px-3 py-2">
                    <span className="text-[#1B3A2D] font-bold text-xs">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-[#B5783A] text-white p-6">
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  Open Your Account Today
                </h3>
                <p className="text-white/80 text-sm mb-5">
                  Call us or stop by. Contractor account applications take about 10 minutes and are typically approved same-day.
                </p>
                <a href={BUSINESS.phoneHref} className="btn-white w-full text-center block mb-3">
                  ☎ {BUSINESS.phone}
                </a>
                <Link href="/contact" className="block text-center border-2 border-white/40 text-white font-semibold text-sm px-4 py-2 hover:border-white transition-colors tracking-widest uppercase">
                  Get Directions
                </Link>
              </div>

              <div className="bg-[#1B3A2D] text-white p-6">
                <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  Store Hours
                </h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>{BUSINESS.hours.weekdays}</li>
                  <li>{BUSINESS.hours.saturday}</li>
                  <li>{BUSINESS.hours.sunday}</li>
                </ul>
              </div>

              <div className="bg-[#F8F5F0] p-6 border border-gray-200">
                <h3 className="font-bold text-[#1B3A2D] text-sm uppercase tracking-widest mb-4">Related Services</h3>
                <ul className="space-y-2">
                  {[
                    { href: "/delivery", label: "Delivery Services" },
                    { href: "/lumber", label: "Lumber Yard" },
                    { href: "/building-materials", label: "Building Materials" },
                    { href: "/tools-hardware", label: "Tools & Hardware" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[#1B3A2D] hover:text-[#B5783A] text-sm font-medium transition-colors">
                        → {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
