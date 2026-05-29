import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Grills & Outdoor Living | Millhurst Mills — Manalapan, NJ",
  description:
    "Top grill brands, outdoor furniture, fire pits, and outdoor living supplies in Manalapan, NJ. Serving Monmouth County homeowners. Visit Millhurst Mills for everything outdoor.",
  alternates: { canonical: "/grills-outdoor-living" },
};

export default function GrillsPage() {
  return (
    <DepartmentPage
      title="Grills & Outdoor Living"
      heroSubtitle="Top grill brands, outdoor furniture, fire pits, and everything to build and complete your outdoor living space — in Manalapan, NJ."
      breadcrumb="Products → Grills & Outdoor Living"
      intro="Make the most of your outdoor space with grills and outdoor living products from Millhurst Mills. We carry top grill brands along with outdoor furniture, fire pits, accessories, and the supplies you need to turn your backyard into a true outdoor living area. Our staff can help you find the right grill for your cooking style and the right accessories to complete the setup. Stop by our outdoor living showroom to see what's in stock."
      products={[
        { name: "Gas Grills", desc: "Propane and natural gas grills from leading brands" },
        { name: "Charcoal Grills", desc: "Kettle grills, barrel grills, and charcoal smokers" },
        { name: "Pellet Grills & Smokers", desc: "Wood pellet grills for versatile cooking and smoking" },
        { name: "Grill Accessories", desc: "Covers, grates, tools, thermometers, and cleaning supplies" },
        { name: "Propane Tanks & Exchange", desc: "Propane cylinder exchange and accessories" },
        { name: "Outdoor Fire Pits", desc: "Wood-burning and gas fire pits for patio ambiance" },
        { name: "Patio Furniture", desc: "Seating, tables, and outdoor furniture sets" },
        { name: "Outdoor Lighting", desc: "String lights, landscape lighting, and solar fixtures" },
        { name: "Lawn & Garden", desc: "Fertilizers, soil, tools, and garden supplies" },
        { name: "Ice Melt & Snow Removal", desc: "Ice melt, snow shovels, and winter supplies" },
      ]}
      features={[
        "Top grill brands with knowledgeable staff to help you choose",
        "Full selection of grill accessories and replacement parts",
        "Seasonal outdoor living products — in-store and ready to take home",
        "Propane exchange service available",
        "Staff who can answer grilling questions and help with setup guidance",
        "Combined with our hardware and building materials — one stop for your outdoor project",
      ]}
      relatedLinks={[
        { href: "/decking-railing", label: "Decking & Railing" },
        { href: "/doors-windows", label: "Doors & Windows" },
        { href: "/ace-hardware", label: "Ace Hardware" },
        { href: "/outlet-closeouts", label: "Outlet & Closeouts" },
      ]}
    />
  );
}
