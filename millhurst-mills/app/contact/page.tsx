import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/business-info";

export const metadata: Metadata = {
  title: "Contact & Directions | Millhurst Mills — Manalapan, NJ",
  description:
    "Contact Millhurst Mills in Manalapan, NJ. Hours, address, phone, and directions. Located on Route 9 in Manalapan, Monmouth County, NJ. Call (732) 446-4848.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact & Directions"
        subtitle="We're located on Route 9 in Manalapan, NJ. Stop in, call us, or send an email — we're always happy to help."
        breadcrumb="Contact"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-[#1B3A2D] mb-8" style={{ fontFamily: "Georgia, serif" }}>
                Store Information
              </h2>

              <div className="space-y-8">
                {/* Address */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#1B3A2D] rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A2D] mb-1">Address</h3>
                    <address className="not-italic text-[#6B6560] leading-relaxed">
                      {BUSINESS.address.street}<br />
                      {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                    </address>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address.full)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[#B5783A] font-semibold text-sm hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#1B3A2D] rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    ☎
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A2D] mb-1">Phone</h3>
                    <a href={BUSINESS.phoneHref} className="text-[#B5783A] font-bold text-2xl hover:text-[#D4944A] transition-colors" style={{ fontFamily: "Georgia, serif" }}>
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#1B3A2D] rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    ✉
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A2D] mb-1">Email</h3>
                    <a href={`mailto:${BUSINESS.email}`} className="text-[#6B6560] hover:text-[#B5783A] transition-colors">
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-[#1B3A2D] rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    🕐
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A2D] mb-3">Store Hours</h3>
                    <table className="text-sm text-[#6B6560]">
                      <tbody className="space-y-2">
                        <tr>
                          <td className="pr-8 py-1 font-medium text-[#1A1A1A]">Monday – Friday</td>
                          <td>7:00 AM – 5:30 PM</td>
                        </tr>
                        <tr>
                          <td className="pr-8 py-1 font-medium text-[#1A1A1A]">Saturday</td>
                          <td>7:00 AM – 4:00 PM</td>
                        </tr>
                        <tr>
                          <td className="pr-8 py-1 font-medium text-[#1A1A1A]">Sunday</td>
                          <td>8:00 AM – 1:00 PM</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-[#6B6560] text-xs mt-2 italic">
                      * Holiday hours may vary. Call ahead on holidays.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service area */}
              <div className="mt-12 bg-[#F8F5F0] p-6">
                <h3 className="font-bold text-[#1B3A2D] mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  We Serve All of Monmouth County
                </h3>
                <p className="text-[#6B6560] text-sm leading-relaxed">
                  Millhurst Mills is conveniently located on Route 9 in Manalapan, serving
                  homeowners and contractors from Manalapan, Marlboro, Freehold, Howell,
                  Colts Neck, Old Bridge, Englishtown, and throughout Monmouth County.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1B3A2D] mb-8" style={{ fontFamily: "Georgia, serif" }}>
                Send Us a Message
              </h2>
              <form
                className="space-y-5"
                action="https://formsubmit.co/info@millhurstmills.com"
                method="POST"
              >
                <input type="hidden" name="_subject" value="Millhurst Mills Website Contact Form" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#1B3A2D] mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A2D] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#1B3A2D] mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 000-0000"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A2D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1B3A2D] mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A2D] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#1B3A2D] mb-2">
                    What can we help you with?
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A2D] transition-colors bg-white"
                  >
                    <option value="">Select a topic...</option>
                    <option>Lumber & Building Materials</option>
                    <option>Ace Hardware</option>
                    <option>Benjamin Moore Paint</option>
                    <option>Decking & Railing</option>
                    <option>Contractor Account</option>
                    <option>Delivery Inquiry</option>
                    <option>General Question</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#1B3A2D] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what you need..."
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A2D] transition-colors resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base">
                  Send Message →
                </button>

                <p className="text-[#6B6560] text-xs">
                  For urgent questions, please call us directly at{" "}
                  <a href={BUSINESS.phoneHref} className="text-[#B5783A] font-semibold">
                    {BUSINESS.phone}
                  </a>
                  . We respond to emails within 1 business day.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map embed */}
      <section className="h-96">
        <iframe
          title="Millhurst Mills Location"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3Lhw&q=Millhurst+Mills+Manalapan+NJ`}
          className="border-0"
        />
      </section>
    </>
  );
}
