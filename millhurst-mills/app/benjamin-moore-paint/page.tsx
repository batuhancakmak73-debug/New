import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Benjamin Moore Paint | Millhurst Mills — Authorized Retailer Manalapan, NJ",
  description:
    "Millhurst Mills is an authorized Benjamin Moore paint retailer in Manalapan, NJ. Premium interior and exterior paints, stains, and finishes. Expert color matching and in-store consultation.",
  alternates: { canonical: "/benjamin-moore-paint" },
};

export default function BenjaminMoorePage() {
  return (
    <DepartmentPage
      title="Benjamin Moore Paint"
      heroSubtitle="Millhurst Mills is your authorized Benjamin Moore paint retailer in Manalapan, NJ — premium paints, expert color matching, and professional guidance."
      breadcrumb="Products → Benjamin Moore Paint"
      brand={{
        name: "Authorized Benjamin Moore Retailer",
        badge: "🎨",
        desc: "Benjamin Moore — the paint professionals have trusted for over 130 years.",
      }}
      intro="Millhurst Mills is proud to be an authorized Benjamin Moore paint retailer serving Manalapan and Monmouth County. Benjamin Moore is widely regarded as the premium choice for both interior and exterior painting — known for exceptional coverage, color accuracy, and durability. Our paint center staff can help you choose the right product for any surface and match or custom-mix your perfect color. We carry the full Benjamin Moore line, from their flagship Regal Select to the professional Aura collection."
      products={[
        { name: "Aura Interior", desc: "The finest Benjamin Moore interior paint — exceptional coverage and color depth" },
        { name: "Aura Exterior", desc: "Premium exterior formula with outstanding durability and fade resistance" },
        { name: "Regal Select", desc: "Trusted all-purpose interior paint with excellent washability" },
        { name: "ben Interior", desc: "Easy-to-use, affordable interior paint for everyday projects" },
        { name: "Natura Zero-VOC", desc: "Virtually odor-free, zero-VOC interior paint for sensitive spaces" },
        { name: "Advance Interior Alkyd", desc: "Waterborne alkyd for trim, cabinets, and furniture" },
        { name: "Exterior Paints & Stains", desc: "Formulated for NJ weather and climate extremes" },
        { name: "Stains & Clear Finishes", desc: "Deck stains, wood finishes, and exterior clear coats" },
        { name: "Primer", desc: "Interior and exterior primers for all surface types" },
        { name: "Color Matching", desc: "Custom color mixing and match-to-any-color service" },
        { name: "Paint Sundries", desc: "Premium brushes, rollers, trays, tape, and application accessories" },
        { name: "Color Samples", desc: "Peel-and-stick color samples and quart samples available" },
      ]}
      features={[
        "Authorized Benjamin Moore retailer — guaranteed authentic products",
        "Expert color consultation: describe your vision, we'll help find your color",
        "Custom color matching — bring in a swatch, chip, or photo",
        "Full product line including specialty, low-VOC, and professional grades",
        "Knowledgeable paint staff with real painting experience",
        "Benjamin Moore fan decks and color samples in-store",
        "Contractor pricing available for professional painters",
      ]}
      ctaHeading="Ready to Start Your Paint Project?"
      ctaText="Visit our paint center in Manalapan for a free color consultation. Our staff will help you choose the right Benjamin Moore product for your project."
      relatedLinks={[
        { href: "/ace-hardware", label: "Ace Hardware" },
        { href: "/tools-hardware", label: "Paint Application Tools" },
        { href: "/contractor-services", label: "Contractor Accounts" },
        { href: "/outlet-closeouts", label: "Outlet & Closeouts" },
      ]}
    />
  );
}
