import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/business-info";

export const metadata: Metadata = {
  title: "Delivery Services | Millhurst Mills — Lumber & Materials Delivery Manalapan NJ",
  description:
    "Millhurst Mills delivers lumber and building materials to job sites throughout Monmouth County, NJ. Call to schedule delivery from our Manalapan store.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <>
      <PageHero
        title="Delivery Services"
        subtitle="We deliver lumber and building materials directly to your job site throughout Monmouth County, NJ — saving you time and trip costs."
        breadcrumb="Services → Delivery"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h2 className="section-heading mb-6">
                We Deliver to Your Job Site
              </h2>
              <p className="text-[#6B6560] text-lg leading-relaxed mb-8">
                Millhurst Mills offers delivery of lumber, building materials, and other
                large purchases directly to job sites and residential addresses throughout
                Monmouth County. Save the time and cost of making multiple trips — let us
                bring your order to you. Our experienced drivers know how to handle building
                materials and deliver on schedule.
              </p>

              {/* Service area */}
              <div className="bg-[#F8F5F0] p-8 mb-10">
                <h3 className="text-xl font-bold text-[#1B3A2D] mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  Delivery Service Area
                </h3>
                <p className="text-[#6B6560] mb-5">
                  We deliver throughout Monmouth County and surrounding areas, including:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUSINESS.serviceArea.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-sm text-[#6B6560]">
                      <span className="text-[#1B3A2D] font-bold">📍</span>
                      {area}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                    <span className="text-[#1B3A2D] font-bold">📍</span>
                    Englishtown
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                    <span className="text-[#1B3A2D] font-bold">📍</span>
                    Aberdeen
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                    <span className="text-[#1B3A2D] font-bold">📍</span>
                    &amp; More — call to confirm
                  </div>
                </div>
              </div>

              {/* What we deliver */}
              <h2 className="text-2xl font-bold text-[#1B3A2D] mb-6" style={{ fontFamily: "Georgia, serif" }}>
                What We Deliver
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Dimensional Lumber & Framing Materials",
                  "Pressure Treated Lumber",
                  "Plywood & Sheet Goods",
                  "LVL Beams & Headers",
                  "Composite Decking & Railing",
                  "Concrete & Masonry Products",
                  "Insulation",
                  "Drywall & Sheetrock",
                  "Roofing Materials",
                  "Doors & Windows",
                  "Bulk Orders — Hardware & Fasteners",
                  "Other Large / Heavy Items",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-[#F8F5F0] px-4 py-3">
                    <span className="text-[#B5783A] font-bold">✓</span>
                    <span className="text-[#6B6560] text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* How to schedule */}
              <h2 className="text-2xl font-bold text-[#1B3A2D] mb-6" style={{ fontFamily: "Georgia, serif" }}>
                How to Schedule a Delivery
              </h2>
              <ol className="space-y-5">
                {[
                  {
                    step: "1",
                    title: "Call Us",
                    desc: `Call ${BUSINESS.phone} during store hours to place your order and request delivery. For large orders, calling a day in advance is recommended.`,
                  },
                  {
                    step: "2",
                    title: "Confirm Your Order & Address",
                    desc: "Our staff will confirm your product list, delivery address, and any site access details (gate codes, road restrictions, etc.).",
                  },
                  {
                    step: "3",
                    title: "Schedule a Delivery Window",
                    desc: "We deliver Monday through Friday. We'll give you a delivery window and confirm it the morning of your delivery.",
                  },
                  {
                    step: "4",
                    title: "Delivery to Your Site",
                    desc: "Our driver will deliver your materials as close to your work area as safely possible. Payment can be arranged in advance.",
                  },
                ].map((s) => (
                  <li key={s.step} className="flex gap-5 items-start">
                    <div className="w-10 h-10 bg-[#1B3A2D] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B3A2D] mb-1">{s.title}</h3>
                      <p className="text-[#6B6560] text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-[#1B3A2D] text-white p-6">
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  Schedule a Delivery
                </h3>
                <p className="text-white/70 text-sm mb-5">
                  Call us during store hours to place your order and schedule delivery.
                </p>
                <a href={BUSINESS.phoneHref} className="btn-amber w-full text-center block mb-3">
                  ☎ {BUSINESS.phone}
                </a>
                <div className="mt-5 pt-5 border-t border-white/10 text-white/60 text-xs space-y-1">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Delivery Hours</p>
                  <p>Monday – Friday</p>
                  <p className="text-white/40">Call to confirm schedule</p>
                </div>
              </div>

              <div className="bg-[#F8F5F0] p-6 border border-gray-200">
                <h3 className="font-bold text-[#1B3A2D] text-sm uppercase tracking-widest mb-4">Need a Contractor Account?</h3>
                <p className="text-[#6B6560] text-sm mb-4">
                  Contractor accounts include priority delivery scheduling and net-terms billing.
                </p>
                <Link href="/contractor-services" className="btn-primary w-full text-center block text-xs">
                  Learn About Accounts
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
