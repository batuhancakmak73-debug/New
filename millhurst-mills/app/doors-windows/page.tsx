import type { Metadata } from "next";
import DepartmentPage from "@/components/DepartmentPage";

export const metadata: Metadata = {
  title: "Doors & Windows | Millhurst Mills — Manalapan, NJ",
  description:
    "Interior and exterior doors, windows, and special order options in Manalapan, NJ. Serving Monmouth County contractors and homeowners. Visit Millhurst Mills for door and window needs.",
  alternates: { canonical: "/doors-windows" },
};

export default function DoorsWindowsPage() {
  return (
    <DepartmentPage
      title="Doors & Windows"
      heroSubtitle="Interior and exterior doors, windows, and special order options for contractors and homeowners in Manalapan and Monmouth County, NJ."
      breadcrumb="Products → Doors & Windows"
      intro="Millhurst Mills carries a selection of interior and exterior doors and windows to complete your home improvement or construction project. From prehung interior doors to exterior entry doors, storm doors, and windows, we stock the most common sizes and styles — and can special order virtually anything else. Our staff can help you take accurate measurements and select the right product for your application, whether you're replacing a single door or outfitting an entire new build."
      products={[
        { name: "Prehung Interior Doors", desc: "Standard and custom sizes in wood, hollow core, and solid core" },
        { name: "Exterior Entry Doors", desc: "Steel, fiberglass, and wood exterior doors — single and double" },
        { name: "Storm Doors", desc: "Full-view and ventilating storm doors with screen options" },
        { name: "Sliding Patio Doors", desc: "Vinyl and aluminum sliding glass doors" },
        { name: "French Doors", desc: "Interior and exterior French door configurations" },
        { name: "Garage Doors", desc: "Residential garage door panels and hardware (special order)" },
        { name: "Windows", desc: "Double-hung, single-hung, casement, and specialty windows" },
        { name: "Door Frames & Jambs", desc: "Rough opening and finish frames for door installations" },
        { name: "Door Hardware", desc: "Locksets, hinges, closers, and door accessories" },
        { name: "Weatherstripping", desc: "Door seals, sweeps, and threshold weatherproofing" },
        { name: "Window Trim", desc: "Casing, sill, and stop moldings for window installation" },
        { name: "Special Order", desc: "Custom sizes, specialty configurations, and non-standard products" },
      ]}
      features={[
        "In-stock selection of common interior and exterior door sizes",
        "Special order capability for custom sizes and specialty products",
        "Staff to help with accurate measurements and product selection",
        "Complete door hardware and accessory inventory",
        "Weatherstripping and finishing supplies for complete installations",
        "Contractor accounts for volume door and window purchases",
      ]}
      relatedLinks={[
        { href: "/building-materials", label: "Building Materials" },
        { href: "/lumber", label: "Lumber & Framing" },
        { href: "/tools-hardware", label: "Tools & Hardware" },
        { href: "/contractor-services", label: "Contractor Services" },
      ]}
    />
  );
}
