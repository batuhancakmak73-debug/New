import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Lumber & Plywood | Millhurst Mills — Manalapan, NJ Lumber Yard",
  description:
    "Full-service lumber yard in Manalapan, NJ. Dimensional lumber, pressure treated, plywood, OSB, and specialty wood. In-stock and ready for pickup or delivery to Monmouth County job sites.",
  alternates: { canonical: "/lumber" },
};

export default function LumberPage() {
  return (
    <DepartmentPage
      title="Lumber & Plywood"
      heroSubtitle="Full-service lumber yard with dimensional lumber, pressure treated, plywood, OSB, and specialty wood — all in stock in Manalapan, NJ."
      breadcrumb="Products → Lumber"
      intro="Millhurst Mills operates a full-service lumber yard serving homeowners and contractors throughout Monmouth County. Whether you need a few boards for a weekend project or full-job-site quantities delivered to your build, we carry the inventory and have the expertise to fulfill your order accurately and quickly. We stock a wide range of lumber species, grades, and sizes — and our yard staff can help you select exactly what your project requires."
      products={[
        { name: "Dimensional Lumber", desc: "2x4, 2x6, 2x8, 2x10, 2x12 in standard and custom lengths" },
        { name: "Pressure Treated Lumber", desc: "Ground contact and above-ground rated, various dimensions" },
        { name: "Plywood", desc: "CDX, pine, cabinet-grade, and specialty plywood sheets" },
        { name: "OSB (Oriented Strand Board)", desc: "Structural sheathing for walls, roofs, and floors" },
        { name: "LVL Beams & Headers", desc: "Engineered lumber for structural applications" },
        { name: "Hardwood Lumber", desc: "Oak, poplar, maple, and more for finish carpentry" },
        { name: "Cedar & Redwood", desc: "Naturally rot-resistant wood for outdoor applications" },
        { name: "Trim & Molding", desc: "Door and window casings, baseboard, crown molding" },
        { name: "Furring Strips", desc: "1x3 and 1x4 furring for framing and fastening" },
        { name: "T&G Flooring", desc: "Tongue and groove for subfloors and finish applications" },
        { name: "Blocking & Bridging", desc: "Pre-cut and standard blocking materials" },
        { name: "Special Order", desc: "Custom lengths and specialty species available on request" },
      ]}
      features={[
        "Full in-stock lumber yard — no waiting for special orders on standard sizes",
        "Knowledgeable yard staff to help you pick the right product for your application",
        "Contractor accounts with bulk pricing and net payment terms",
        "Job-site delivery throughout Monmouth County — call to schedule",
        "Family-owned business that has served Manalapan contractors since 1925",
        "Accurate cut lists and order fulfillment for builders",
        "Competitive pricing on all lumber products",
      ]}
      ctaHeading="Need Lumber Delivered to Your Job Site?"
      ctaText="Millhurst Mills delivers lumber and building materials throughout Monmouth County. Call us to discuss your project requirements and schedule delivery."
      relatedLinks={[
        { href: "/building-materials", label: "Building Materials" },
        { href: "/decking-railing", label: "Decking & Railing" },
        { href: "/contractor-services", label: "Contractor Services" },
        { href: "/delivery", label: "Delivery Information" },
      ]}
    />
  );
}
