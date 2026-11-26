import React from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | The Royal Bengal Fresh",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back Link */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800 hover:text-emerald-950 transition-colors">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold">
            <Truck size={14} className="text-emerald-700" /> Logistics &amp; Cold-Chain
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif">Shipping &amp; Delivery Policy</h1>
          <p className="text-xs text-gray-500 font-medium">The Royal Bengal Fresh (SS Anandamayee Enterprises) | Effective date: 12 November 2026</p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-600">

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
            <p className="font-bold text-gray-900">Entity &amp; Regulatory Information:</p>
            <p><strong>Business Name:</strong> The Royal Bengal Fresh (SS Anandamayee Enterprises)</p>
            <p><strong>FSSAI License No:</strong> 23626028007758</p>
            <p><strong>Jurisdiction:</strong> Courts of Hyderabad &amp; Rangareddy, Telangana, India</p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Cold-Chain &amp; Freshness Guarantee</h2>
            <p>
              We provide temperature-controlled delivery for perishable items (fish, seafood, and fresh meat). All orders are packed in insulated thermal bags with cold-packs to ensure optimal freshness upon arrival at your doorstep.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Delivery Timings &amp; Sourcing</h2>
            <p>
              We aim to deliver your order within <strong>24 hours</strong> of confirmation. However, because our specialty products and artisanal catches are sourced directly from Kolkata and regional waters, transit schedules may occasionally be subject to inter-state flight or train cargo timings.
            </p>
            <p>
              Furthermore, delivery timings may be affected by circumstances beyond our control, including adverse weather conditions, local festivals, heavy traffic congestion, or unforeseen transit disruptions.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Rescheduling &amp; Delivery Attempts</h2>
            <p>
              Any requests to reschedule an order must be communicated to our support team <strong>prior to dispatch</strong>. Given the highly perishable nature of our specialty foods, rescheduling requests and subsequent delivery attempts are handled at the <strong>sole discretion of The Royal Bengal Fresh</strong>.
            </p>
            <p>
              Additional delivery charges may apply for failed delivery attempts, incorrect address details, or customer unavailability, and such charges must be borne entirely by the customer.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Third-Party Logistics Partners</h2>
            <p>
              To ensure prompt door delivery, we dispatch orders directly from our hub as well as through trusted third-party fleet partners (such as Rapido, Porter, Uber, Dunzo, or local courier services). Delivery personnel are bound by confidentiality to handle perishable orders with care.
            </p>
          </section>

          {/* Section 5: Contact */}
          <section className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Logistics Support &amp; Contact</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-700">Customer Support:</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Mail size={13} className="text-emerald-800" /> care@rbnow.in</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Phone size={13} className="text-emerald-800" /> 6304076069</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-700">Grievance Officer:</p>
                <p className="font-bold text-gray-900">Mustafa Hussain</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Mail size={13} className="text-emerald-800" /> care@rbnow.in</p>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-200/60 text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-700 flex items-center gap-1"><MapPin size={13} className="text-emerald-800" /> Business Registered Address:</p>
              <p>SS Anandamayee Enterprises, Rajendranagar, Rangareddy, Telangana 500086</p>
              <p className="font-bold text-amber-900 pt-1">FSSAI Lic. No: 23626028007758</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
