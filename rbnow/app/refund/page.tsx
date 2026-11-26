import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin, RefreshCw, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Refund and Cancellation Policy | The Royal Bengal Fresh",
};

export default function RefundPolicyPage() {
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
            <RefreshCw size={14} className="text-emerald-700" /> Customer Assurance &amp; Resolution
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif">Refund and Cancellation Policy</h1>
          <p className="text-xs text-gray-500 font-medium">The Royal Bengal Fresh (SS Anandamayee Enterprises) | Effective date: 12 November 2026</p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-600">

          <p>
            This policy governs all standard orders, special orders, and <strong>pre-orders</strong> for fresh fish, seafood, meat, vegetables, and groceries purchased directly from <strong>The Royal Bengal Fresh</strong> in India.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Cancellations &amp; Pre-Orders Policy (Sole Discretion)</h2>
            <p>
              Due to the highly perishable and custom-prepared nature of our boutique offerings, <strong>no cancellations are allowed</strong> once an order or pre-order has been confirmed and preparation or sourcing has commenced.
            </p>
            <p>
              All refund requests, order modifications, and cancellation exceptions are granted solely at the <strong>discretion of The Royal Bengal Fresh</strong>. The final decision regarding any refund, cancellation, or dispute resolution rests entirely and exclusively with management.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Inspection &amp; Complaints Window (24 Hours)</h2>
            <p>
              Because we deal in ultra-fresh perishables, please inspect your delivery immediately upon receipt. Any concerns regarding freshness, quality, incorrect cuts, short weight, or missing items should be reported to our customer support team within <strong>24 hours</strong> of delivery with accompanying photographs.
            </p>
            <p>
              For packaged grocery items, reporting should be done within <strong>7 days</strong>. Do not consume any food product you suspect is unsafe; store it securely while contacting us for verification.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Quality Standards &amp; Item-Level Adjustments</h2>
            <p>
              Because we procure fresh catches and boutique cuts daily, every item undergoes strict quality inspections. If any product or item we procure fails to meet our uncompromising quality standards, <strong>The Royal Bengal Fresh</strong> reserves the sole discretion to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Replace the item with an equivalent or superior cut/alternative upon customer notification.</li>
              <li>Cancel and issue an immediate refund for the affected item.</li>
              <li>Reschedule and deliver the item at a later date once fresh stock meeting our quality standards becomes available.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Resolution: Refunds &amp; Replacements</h2>
            <p>
              Where a verified quality or fulfillment issue is confirmed by our management, we may offer a refund to your original payment method or a complimentary replacement.
            </p>
            <p>
              Approved refunds are initiated within <strong>2 business days</strong>. Depending on your bank or payment provider (Razorpay/UPI/Cards), funds typically reflect in your account within <strong>5–7 business days</strong>.
            </p>
          </section>

          {/* Section 4: Support & Grievance */}
          <section className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Support &amp; Resolution Desk</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-700">Customer Support:</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Mail size={13} className="text-emerald-800" /> care@rbnow.in</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Phone size={13} className="text-emerald-800" /> 6304076069</p>
                <p className="text-gray-500 font-medium">Support hours: 8:00 AM – 8:00 PM IST</p>
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
