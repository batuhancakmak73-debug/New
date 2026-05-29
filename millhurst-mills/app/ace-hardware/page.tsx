import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Ace Hardware | Millhurst Mills — Authorized Dealer Manalapan, NJ",
  description:
    "Millhurst Mills is an authorized Ace Hardware dealer in Manalapan, NJ. Shop tools, fasteners, plumbing, electrical, outdoor, and more — local service with national brand quality.",
  alternates: { canonical: "/ace-hardware" },
};

export default function AceHardwarePage() {
  return (
    <DepartmentPage
      title="Ace Hardware"
      heroSubtitle="Millhurst Mills is your authorized Ace Hardware dealer in Manalapan, NJ — national brand quality with the personal service of a local store."
      breadcrumb="Products → Ace Hardware"
      brand={{
        name: "Authorized Ace Hardware Dealer",
        badge: "🔧",
        desc: "Ace is the place with the helpful hardware folks — right here in Manalapan.",
      }}
      intro="As an authorized Ace Hardware dealer, Millhurst Mills carries the full range of Ace Hardware products — from hand tools and power tools to plumbing, electrical, outdoor, and home supplies. The difference is that when you shop at Millhurst Mills, you get the national brand quality you trust with the local, knowledgeable service that big-box stores simply can't match. Our hardware staff knows their products and can help you find exactly what you need for any project."
      products={[
        { name: "Hand Tools", desc: "Hammers, screwdrivers, levels, measuring tools, and more" },
        { name: "Power Tools", desc: "Drills, saws, sanders, grinders — major brands in stock" },
        { name: "Fasteners & Anchors", desc: "Screws, nails, bolts, anchors, and specialty fasteners" },
        { name: "Plumbing Supplies", desc: "Fittings, valves, pipe, faucets, and repair parts" },
        { name: "Electrical", desc: "Wire, outlets, switches, breakers, conduit, and fixtures" },
        { name: "Outdoor & Garden", desc: "Hoses, sprinklers, garden tools, and outdoor maintenance" },
        { name: "Paint Supplies", desc: "Brushes, rollers, tape, drop cloths, and application tools" },
        { name: "Safety & PPE", desc: "Gloves, glasses, respirators, and protective gear" },
        { name: "Cleaning & Maintenance", desc: "Lubricants, solvents, cleaners, and shop supplies" },
        { name: "Locksets & Security", desc: "Door hardware, padlocks, deadbolts, and access control" },
        { name: "Adhesives & Caulk", desc: "Glues, epoxies, silicone, and construction adhesives" },
        { name: "Storage & Organization", desc: "Shelving, cabinets, bins, and workbench accessories" },
      ]}
      features={[
        "Authorized Ace Hardware dealer — full product catalog and rewards program",
        "Staff that knows hardware — ask a question, get a real answer",
        "In-stock inventory on essential hardware items",
        "Competitive pricing with Ace Hardware quality guarantee",
        "No searching for help — our team is always on the floor",
        "Local store, local service — none of the frustration of big-box retail",
        "Special orders available for Ace catalog items not in regular stock",
      ]}
      relatedLinks={[
        { href: "/tools-hardware", label: "Tools & Hardware" },
        { href: "/building-materials", label: "Building Materials" },
        { href: "/benjamin-moore-paint", label: "Benjamin Moore Paint" },
        { href: "/contractor-services", label: "Contractor Services" },
      ]}
    />
  );
}
