import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BUSINESS, SITE_URL } from "@/lib/business-info";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Millhurst Mills | Lumber, Hardware & Building Materials in Manalapan NJ",
    template: "%s | Millhurst Mills — Manalapan, NJ",
  },
  description:
    "Millhurst Mills is Manalapan's local source for lumber, Ace Hardware, Benjamin Moore paint, decking, grills, doors & windows. Family-owned since 1925. Serving Monmouth County, NJ.",
  keywords: [
    "lumber yard Manalapan NJ",
    "hardware store Manalapan NJ",
    "Ace Hardware Manalapan",
    "Benjamin Moore paint Manalapan NJ",
    "building materials Monmouth County NJ",
    "decking Manalapan NJ",
    "contractor supplies Manalapan NJ",
    "lumber Marlboro NJ",
    "hardware store Freehold NJ",
    "Millhurst Mills",
    "building supplies Central NJ",
  ],
  authors: [{ name: "Millhurst Mills" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Millhurst Mills",
    title: "Millhurst Mills | Lumber, Hardware & Building Materials — Manalapan, NJ",
    description:
      "Family-owned since 1925. Manalapan's local source for lumber, Ace Hardware, Benjamin Moore paint, decking & more. Serving Monmouth County.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Millhurst Mills — Manalapan, NJ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Millhurst Mills | Lumber & Hardware — Manalapan, NJ",
    description:
      "Family-owned since 1925. Lumber, Ace Hardware, Benjamin Moore Paint, Decking & more in Manalapan, NJ.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "Store"],
  name: BUSINESS.name,
  alternateName: "Millhurst Mills Ace Hardware",
  description: BUSINESS.description,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.state,
    postalCode: BUSINESS.address.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS.geo.lat,
    longitude: BUSINESS.geo.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "07:00",
      closes: "16:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Check",
  sameAs: [BUSINESS.social.google, BUSINESS.social.facebook],
  department: [
    {
      "@type": "HomeAndConstructionBusiness",
      name: "Millhurst Mills Lumber Yard",
      description:
        "Full-service lumber yard with dimensional lumber, plywood, pressure treated lumber, and more.",
    },
    {
      "@type": "Store",
      name: "Millhurst Mills Ace Hardware",
      description:
        "Authorized Ace Hardware dealer. Tools, fasteners, paint, outdoor, plumbing, electrical.",
    },
    {
      "@type": "Store",
      name: "Millhurst Mills Benjamin Moore Paint Center",
      description:
        "Authorized Benjamin Moore paint dealer. Interior and exterior paints, stains, and finishes.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded via globals.css @import */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
