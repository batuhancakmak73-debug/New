import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Tools & Hardware | Millhurst Mills — Manalapan, NJ Hardware Store",
  description:
    "Hand tools, power tools, fasteners, and hardware essentials at Millhurst Mills in Manalapan, NJ. Authorized Ace Hardware dealer. Serving Monmouth County contractors and homeowners.",
  alternates: { canonical: "/tools-hardware" },
};

export default function ToolsHardwarePage() {
  return (
    <DepartmentPage
      title="Tools & Hardware"
      heroSubtitle="Hand tools, power tools, fasteners, anchors, and the hardware essentials every project demands — at your local Manalapan hardware store."
      breadcrumb="Products → Tools & Hardware"
      intro="Millhurst Mills stocks a comprehensive selection of tools and hardware for both the professional contractor and the homeowner DIYer. As an authorized Ace Hardware dealer, we carry major tool brands alongside the fasteners, anchors, connectors, and hardware essentials that every project requires. Our hardware department is staffed by people who actually know tools and can help you select the right product — not just point you to an aisle."
      products={[
        { name: "Hand Tools", desc: "Hammers, screwdrivers, wrenches, pliers, chisels, and measuring tools" },
        { name: "Power Tools", desc: "Drills, circular saws, jigsaws, reciprocating saws, and sanders" },
        { name: "Air Tools", desc: "Nailers, staplers, compressors, and pneumatic tool accessories" },
        { name: "Layout & Measuring", desc: "Levels, squares, tape measures, chalk lines, and laser tools" },
        { name: "Concrete Tools", desc: "Trowels, floats, edgers, mixers, and masonry tools" },
        { name: "Cutting Tools", desc: "Utility knives, blades, tin snips, and scoring tools" },
        { name: "Fasteners — Nails", desc: "Common, framing, finish, roofing, and specialty nails" },
        { name: "Fasteners — Screws", desc: "Deck, drywall, wood, sheet metal, and specialty screws" },
        { name: "Bolts & Anchors", desc: "Machine bolts, lag bolts, concrete anchors, and toggle bolts" },
        { name: "Structural Connectors", desc: "Joist hangers, post bases, hurricane ties, and framing hardware" },
        { name: "Hinges & Cabinet Hardware", desc: "Door hinges, drawer pulls, cabinet latches, and furniture hardware" },
        { name: "Safety & PPE", desc: "Safety glasses, gloves, dust masks, ear protection, and hard hats" },
      ]}
      features={[
        "Authorized Ace Hardware dealer — full tool catalog available",
        "Staff with real tool experience — ask questions, get real answers",
        "Comprehensive fastener and anchor selection in standard and metric",
        "Structural connectors and framing hardware for contractors",
        "Special orders available for tools and hardware not in regular stock",
        "Contractor accounts for professional volume purchases",
        "No hunting for help — our team is always on the floor and ready to assist",
      ]}
      relatedLinks={[
        { href: "/ace-hardware", label: "Ace Hardware Department" },
        { href: "/building-materials", label: "Building Materials" },
        { href: "/contractor-services", label: "Contractor Services" },
        { href: "/outlet-closeouts", label: "Tool Outlet Deals" },
      ]}
    />
  );
}
