import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Building Materials | Millhurst Mills — Manalapan, NJ",
  description:
    "Building materials in Manalapan, NJ. Concrete, masonry, insulation, roofing, siding, drywall, and structural materials for contractors and homeowners in Monmouth County.",
  alternates: { canonical: "/building-materials" },
};

export default function BuildingMaterialsPage() {
  return (
    <DepartmentPage
      title="Building Materials"
      heroSubtitle="Everything you need to build, frame, insulate, roof, and finish — all in stock at our Manalapan, NJ store."
      breadcrumb="Products → Building Materials"
      intro="From the foundation to the roof, Millhurst Mills carries the building materials that contractors and homeowners rely on for every stage of construction and renovation. Our full inventory includes concrete and masonry products, insulation, roofing, siding, drywall, and more — all available in-store or delivered to your Monmouth County job site."
      products={[
        { name: "Concrete & Mortar", desc: "Bags and bulk concrete mixes, mortar, grout, and patching compounds" },
        { name: "Concrete Block & Brick", desc: "Standard and specialty masonry blocks and bricks" },
        { name: "Insulation", desc: "Batt, rigid, and spray foam insulation products" },
        { name: "Drywall & Sheetrock", desc: "Standard, moisture-resistant, and fire-rated drywall sheets and accessories" },
        { name: "Roofing Materials", desc: "Shingles, underlayment, ice & water shield, flashing" },
        { name: "House Wrap & Building Paper", desc: "Tyvek and other weather-resistant barriers" },
        { name: "Siding & Trim", desc: "Vinyl, fiber cement, and wood siding options" },
        { name: "Vapor Barrier", desc: "Ground cover and wall vapor barriers" },
        { name: "Adhesives & Sealants", desc: "Construction adhesives, caulks, foams, and sealants" },
        { name: "Safety Equipment", desc: "Hard hats, safety glasses, gloves, and site safety supplies" },
      ]}
      features={[
        "Comprehensive in-stock inventory for all phases of construction",
        "Knowledgeable staff to help contractors spec the right materials",
        "Bulk pricing available for contractor and volume purchases",
        "Delivery to job sites throughout Monmouth County",
        "Special order capabilities for items not in our standard stock",
        "Family-owned, trusted by Monmouth County builders for over 100 years",
      ]}
      relatedLinks={[
        { href: "/lumber", label: "Lumber & Plywood" },
        { href: "/tools-hardware", label: "Tools & Hardware" },
        { href: "/contractor-services", label: "Contractor Services" },
        { href: "/delivery", label: "Delivery Information" },
      ]}
    />
  );
}
