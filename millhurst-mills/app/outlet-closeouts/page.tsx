import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { BUSINESS } from "@/lib/business-info";

export const metadata: Metadata = {
  title: "Outlet & Closeouts | Millhurst Mills — Deals on Building Materials, Manalapan NJ",
  description:
    "Discounted building materials, overstock, and closeout deals at Millhurst Mills in Manalapan, NJ. Quality products at reduced prices. New items added regularly.",
  alternates: { canonical: "/outlet-closeouts" },
};

export default function OutletPage() {
  return (
    <>
      <PageHero
        title="Outlet & Closeouts"
        subtitle="Discounted building materials, overstock, and closeout products — quality you trust at prices you'll love."
        breadcrumb="Products → Outlet & Closeouts"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div className="bg-[#B5783A]/10 border border-[#B5783A]/30 p-6 mb-10">
                <p className="text-[#1B3A2D] font-semibold text-lg mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  🏷️ Inventory Changes Frequently
                </p>
                <p className="text-[#6B6560]">
                  Outlet and closeout inventory changes regularly. For the most current selection
                  of discounted items, please call us at{" "}
                  <a href={BUSINESS.phoneHref} className="text-[#B5783A] font-semibold">
                    {BUSINESS.phone}
                  </a>{" "}
                  or stop by the store. Our staff can let you know what deals are available today.
                </p>
              </div>

              <p className="text-[#6B6560] text-lg leading-relaxed mb-10">
                Our Outlet &amp; Closeouts section features discounted building materials, overstock
                items, and end-of-season products at reduced prices. These are genuine quality
                products — the same brands we carry in our regular inventory — offered at a discount
                due to overstock, discontinued lines, or seasonal clearance. It&rsquo;s a great
                way to save on your next project if you have flexibility on brand or color.
              </p>

              <h2 className="text-2xl font-bold text-[#1B3A2D] mb-6" style={{ fontFamily: "Georgia, serif" }}>
                Types of Closeout Items We Carry
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Lumber & Plywood Overstock",
                  "Paint Colors Being Discontinued",
                  "Seasonal Decking Products",
                  "Discontinued Hardware Items",
                  "Floor & Display Model Grills",
                  "Building Material Overstock",
                  "Tool Clearance Items",
                  "Outdoor Living Closeouts",
                  "Door & Window Overstocks",
                  "Fastener & Connector Lots",
                  "Insulation & Drywall Lots",
                  "Miscellaneous Hardware Lots",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-[#F8F5F0] px-4 py-3">
                    <span className="text-[#B5783A] font-bold">✓</span>
                    <span className="text-[#6B6560] text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-[#1B3A2D] mb-4" style={{ fontFamily: "Georgia, serif" }}>
                How It Works
              </h2>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Call or Stop By",
                    desc: "Ask our staff about current closeout inventory — we can tell you exactly what's available at a discount today.",
                  },
                  {
                    step: "2",
                    title: "First Come, First Served",
                    desc: "Outlet items are sold as-is while supplies last. We can't hold closeout items, so come in when you're ready to buy.",
                  },
                  {
                    step: "3",
                    title: "No Compromises on Quality",
                    desc: "Every closeout item is a genuine quality product. We don't sell damaged or defective goods — just overstock and discontinued items.",
                  },
                ].map((s) => (
                  <div key={s.step} className="flex gap-5 items-start">
                    <div className="w-10 h-10 bg-[#1B3A2D] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B3A2D] mb-1">{s.title}</h3>
                      <p className="text-[#6B6560] text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-[#1B3A2D] text-white p-6">
                <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  Ask About Today&rsquo;s Deals
                </h3>
                <p className="text-white/70 text-sm mb-5">
                  Our outlet inventory changes regularly. Call us to ask what closeout items are available right now.
                </p>
                <a href={BUSINESS.phoneHref} className="btn-amber w-full text-center mb-3 block">
                  ☎ {BUSINESS.phone}
                </a>
                <Link href="/contact" className="btn-white w-full text-center block text-xs">
                  Get Directions
                </Link>
                <div className="mt-5 pt-5 border-t border-white/10 text-white/60 text-xs space-y-1">
                  <p>{BUSINESS.hours.weekdays}</p>
                  <p>{BUSINESS.hours.saturday}</p>
                  <p>{BUSINESS.hours.sunday}</p>
                </div>
              </div>
              <div className="bg-[#F8F5F0] p-6 border border-gray-200">
                <h3 className="font-bold text-[#1B3A2D] text-sm uppercase tracking-widest mb-4">More Departments</h3>
                <ul className="space-y-2">
                  {[
                    { href: "/lumber", label: "Lumber & Plywood" },
                    { href: "/building-materials", label: "Building Materials" },
                    { href: "/tools-hardware", label: "Tools & Hardware" },
                    { href: "/benjamin-moore-paint", label: "Benjamin Moore Paint" },
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
