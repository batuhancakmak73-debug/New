"use client";

import { useState, useEffect } from "react";
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
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1B3A2D] text-white/80 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>Serving Manalapan & Monmouth County since 1925 — Authorized Ace Hardware &amp; Benjamin Moore Dealer</span>
          <div className="flex items-center gap-6">
            <a href={BUSINESS.phoneHref} className="hover:text-white transition-colors font-medium">
              ☎ {BUSINESS.phone}
            </a>
            <span>{BUSINESS.hours.weekdays.split(":")[1].trim()} weekdays</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#1B3A2D] shadow-lg" : "bg-[#1B3A2D]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-tight group">
              <span className="text-white font-bold text-xl md:text-2xl tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                MILLHURST MILLS
              </span>
              <span className="text-[#B5783A] text-[10px] md:text-xs tracking-widest uppercase">
                Est. 1925 · Manalapan, NJ
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Products dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button className="flex items-center gap-1 text-white/90 hover:text-white font-medium text-sm tracking-wide px-4 py-2 transition-colors">
                  Products
                  <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {productsOpen && (
                  <div className="absolute top-full left-0 w-56 bg-white shadow-xl border-t-2 border-[#B5783A] z-50">
                    {productLinks.map((l) => (
                      <Link key={l.href} href={l.href} className="nav-dropdown-item">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Services dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="flex items-center gap-1 text-white/90 hover:text-white font-medium text-sm tracking-wide px-4 py-2 transition-colors">
                  Services
                  <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl border-t-2 border-[#B5783A] z-50">
                    {serviceLinks.map((l) => (
                      <Link key={l.href} href={l.href} className="nav-dropdown-item">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/gallery" className="text-white/90 hover:text-white font-medium text-sm tracking-wide px-4 py-2 transition-colors">
                Gallery
              </Link>
              <Link href="/about" className="text-white/90 hover:text-white font-medium text-sm tracking-wide px-4 py-2 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-white/90 hover:text-white font-medium text-sm tracking-wide px-4 py-2 transition-colors">
                Contact
              </Link>

              <a href={BUSINESS.phoneHref} className="ml-4 btn-amber text-xs">
                ☎ Call Now
              </a>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#132B21] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Mobile Products */}
              <button
                className="w-full text-left flex justify-between items-center text-white font-medium py-2.5 text-sm"
                onClick={() => setMobileProducts(!mobileProducts)}
              >
                Products
                <svg className={`w-4 h-4 transition-transform ${mobileProducts ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileProducts && (
                <div className="pl-4 space-y-1 border-l-2 border-[#B5783A]">
                  {productLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="block text-white/80 hover:text-white py-2 text-sm" onClick={() => setMobileOpen(false)}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile Services */}
              <button
                className="w-full text-left flex justify-between items-center text-white font-medium py-2.5 text-sm"
                onClick={() => setMobileServices(!mobileServices)}
              >
                Services
                <svg className={`w-4 h-4 transition-transform ${mobileServices ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileServices && (
                <div className="pl-4 space-y-1 border-l-2 border-[#B5783A]">
                  {serviceLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="block text-white/80 hover:text-white py-2 text-sm" onClick={() => setMobileOpen(false)}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}

              {[{ href: "/gallery", label: "Gallery" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }].map((l) => (
                <Link key={l.href} href={l.href} className="block text-white font-medium py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}

              <a href={BUSINESS.phoneHref} className="block mt-4 btn-amber text-center">
                ☎ {BUSINESS.phone}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
