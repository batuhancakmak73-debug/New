const badges = [
  { icon: "🏠", title: "Family-Owned", sub: "Since 1925" },
  { icon: "🔧", title: "Ace Hardware", sub: "Authorized Dealer" },
  { icon: "🎨", title: "Benjamin Moore", sub: "Authorized Retailer" },
  { icon: "🌲", title: "Full Lumber Yard", sub: "In-Stock Inventory" },
  { icon: "🚛", title: "Job-Site Delivery", sub: "Monmouth County" },
  { icon: "👷", title: "Contractor Accounts", sub: "Open Net Terms" },
];

export default function TrustBadges() {
  return (
    <section className="bg-[#F8F5F0] py-14 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((b) => (
            <div key={b.title} className="text-center">
              <div className="text-3xl mb-2">{b.icon}</div>
              <p className="font-bold text-[#1B3A2D] text-sm" style={{ fontFamily: "Georgia, serif" }}>
                {b.title}
              </p>
              <p className="text-[#6B6560] text-xs mt-0.5">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
