import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Decking & Railing | Millhurst Mills — Manalapan, NJ",
  description:
    "Composite and pressure treated decking, railing systems, and deck hardware in Manalapan, NJ. Serving Monmouth County contractors and homeowners. Free project estimates.",
  alternates: { canonical: "/decking-railing" },
};

export default function DeckingPage() {
  return (
    <DepartmentPage
      title="Decking & Railing"
      heroSubtitle="Composite and pressure treated decking, railing systems, and hardware — everything you need to build a beautiful, lasting outdoor deck in Manalapan, NJ."
      breadcrumb="Products → Decking & Railing"
      intro="Transform your outdoor space with decking and railing products from Millhurst Mills. We carry composite decking, pressure treated wood, and a wide selection of railing systems for every style and budget. Whether you're a contractor building multiple decks a season or a homeowner taking on your first deck project, our team has the knowledge to help you choose the right materials and understand what the job requires. We also stock all the hardware, fasteners, and accessories your deck build needs."
      products={[
        { name: "Composite Decking", desc: "Premium composite boards in multiple colors and profiles — low maintenance, high durability" },
        { name: "Pressure Treated Decking", desc: "Ground-contact rated PT lumber for structural deck framing and boards" },
        { name: "Cedar Decking", desc: "Natural, aromatic cedar boards for classic wood deck look" },
        { name: "Deck Boards", desc: "5/4 and 2x6 deck boards in PT, cedar, and composite" },
        { name: "Deck Frame Lumber", desc: "Pressure treated joists, beams, posts, and ledgers" },
        { name: "Post Caps & Bases", desc: "Structural hardware for post connections and footings" },
        { name: "Railing Systems", desc: "Aluminum, vinyl, wood, and cable railing systems" },
        { name: "Balusters & Spindles", desc: "Classic and contemporary baluster options" },
        { name: "Rail Posts & Caps", desc: "Decorative and structural post and cap systems" },
        { name: "Deck Screws & Fasteners", desc: "Hidden fasteners, structural screws, and specialty deck hardware" },
        { name: "Joist Hangers & Hardware", desc: "Structural connectors for deck framing" },
        { name: "Stains & Sealers", desc: "Deck stains, water sealers, and wood preservatives" },
      ]}
      features={[
        "Wide selection of composite and pressure treated decking products",
        "Multiple railing system options for every style and budget",
        "Knowledgeable staff to help you plan your deck project",
        "Complete in-stock hardware and fastener selection",
        "Material estimates and cut lists available — bring your deck plans",
        "Contractor pricing and volume discounts available",
        "Delivery to your job site throughout Monmouth County",
      ]}
      ctaHeading="Planning a Deck Project?"
      ctaText="Bring your plans to Millhurst Mills and our staff will help you put together a complete material list and price estimate for your deck build."
      relatedLinks={[
        { href: "/lumber", label: "Lumber & Framing" },
        { href: "/grills-outdoor-living", label: "Grills & Outdoor Living" },
        { href: "/tools-hardware", label: "Tools & Hardware" },
        { href: "/contractor-services", label: "Contractor Services" },
      ]}
    />
  );
}
