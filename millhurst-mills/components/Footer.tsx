import Link from "next/link";
import { BUSINESS } from "@/lib/business-info";

const productLinks = [
  { href: "/building-materials", label: "Building Materials" },
  { href: "/lumber", label: "Lumber & Plywood" },
  { href: "/ace-hardware", label: "Ace Hardware" },
  { href: "/benjamin-moore-paint", label: "Benjamin Moore Paint" },
  { href: "/decking-railing", label: "Decking & Railing" },
  { href: "/grills-outdoor-living", label: "Grills & Outdoor Living" },
  { href: "/doors-windows", label: "Doors & Windows" },
  { href: "/tools-hardware", label: "Tools & Hardware" },
  { href: "/outlet-closeouts", label: "Outlet & Closeouts" },
];

const serviceLinks = [
  { href: "/contractor-services", label: "Contractor Services" },
  { href: "/delivery", label: "Delivery Services" },
  { href: "/gallery", label: "Photo Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact & Directions" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F2419] text-white">
      {/* Top CTA bar */}
      <div className="bg-[#B5783A] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-white text-lg" style={{ fontFamily: "Georgia, serif" }}>
            Questions? We&rsquo;re here to help.
          </p>
          <div className="flex gap-4">
            <a href={BUSINESS.phoneHref} className="bg-white text-[#B5783A] font-bold px-6 py-2 text-sm tracking-widest uppercase hover:bg-[#F8F5F0] transition-colors">
              ☎ {BUSINESS.phone}
            </a>
            <Link href="/contact" className="border-2 border-white text-white font-bold px-6 py-2 text-sm tracking-widest uppercase hover:bg-white hover:text-[#B5783A] transition-colors">
              Get Directions
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
                MILLHURST MILLS
              </span>
              <br />
              <span className="text-[#B5783A] text-xs tracking-widest uppercase">Est. 1925 · Manalapan, NJ</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Manalapan&rsquo;s local source for lumber, hardware, paint, decking and remodeling supplies. Serving Monmouth County for over 100 years.
            </p>
            <div className="space-y-2">
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Authorized Dealer</p>
              <div className="flex gap-3 flex-wrap">
                <span className="bg-white/10 text-white/80 px-3 py-1 text-xs font-medium">ACE HARDWARE</span>
                <span className="bg-white/10 text-white/80 px-3 py-1 text-xs font-medium">BENJAMIN MOORE</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Products
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-[#B5783A] text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Pages */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Services & Info
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-[#B5783A] text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Visit Us
            </h3>
            <address className="not-italic space-y-3">
              <p className="text-white/80 text-sm leading-relaxed">
                {BUSINESS.address.street}<br />
                {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
              </p>
              <a href={BUSINESS.phoneHref} className="block text-[#B5783A] font-semibold text-sm hover:text-[#D4944A] transition-colors">
                {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="block text-white/60 text-sm hover:text-white transition-colors">
                {BUSINESS.email}
              </a>
            </address>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Store Hours</p>
              <ul className="space-y-1.5 text-sm text-white/70">
                <li>{BUSINESS.hours.weekdays}</li>
                <li>{BUSINESS.hours.saturday}</li>
                <li>{BUSINESS.hours.sunday}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Millhurst Mills. All rights reserved. · {BUSINESS.address.city}, {BUSINESS.address.state}
          </p>
          <p className="text-white/30 text-xs">
            Serving {BUSINESS.serviceArea.slice(0, 5).join(", ")} & surrounding areas
          </p>
        </div>
      </div>
    </footer>
  );
}
