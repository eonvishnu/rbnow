import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

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
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif">Refund and Cancellation Policy</h1>
          <p className="mt-2 text-xs text-gray-500 font-medium">The Royal Bengal Fresh | Effective date: 12 November 2026</p>
        </div>

        {/* Policy Content */}
        <div className="space-y-6 text-sm leading-relaxed text-gray-600">

          <p>
            This policy covers orders for fish, seafood, meat, vegetables and groceries purchased directly from <strong>The Royal Bengal Fresh</strong> in India. It explains when you can cancel an order and how we resolve missing, incorrect or unsatisfactory deliveries. Purchases made through another marketplace should be reported through that platform as well.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Cancelling or changing an order</h2>
            <p>
              Contact our support team with your order number as soon as you wish to cancel or change an order. Before preparation begins, you may cancel the whole order or individual items without a cancellation fee. We will refund the amount paid for cancelled items; a full cancellation also includes delivery and packing charges.
            </p>
            <p>
              Once fish or meat has been cleaned or cut to your order, or perishable items have been prepared or dispatched, we may be unable to accept a change-of-mind cancellation. We will check the actual preparation status and confirm what can still be cancelled. An “Unfulfilled” status alone does not mean preparation has not started. This restriction does not affect complaints about quality, incorrect goods, non-delivery or other rights under applicable law.
            </p>
            <p>
              Changes to products, quantities, cuts or delivery details depend on availability and preparation status. We will confirm any price difference before making the change. We do not charge a separate cancellation fee.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. If we cannot fulfil your order</h2>
            <p>
              If an item is unavailable, fails our quality checks or cannot be delivered, we will notify you and refund the amount paid for that item. We will not substitute a different product or cut without your agreement. If we cancel the entire order, we will refund all amounts paid, including delivery and packing charges.
            </p>
            <p>
              If delivery is late against the schedule confirmed for your order, contact us for cancellation or refund assistance. We will assess delays caused by exceptional events beyond our control in line with applicable law. Missing or unsafe goods remain eligible for review regardless of the cause of delay.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Reporting an issue</h2>
            <p>
              Please check your delivery promptly. For fish, seafood, meat and vegetables, report visible damage, incorrect or missing items, or freshness concerns as soon as possible, preferably within <strong>24 hours</strong> of delivery. For packaged groceries, please report issues preferably within <strong>7 days</strong>, or promptly after discovering a hidden defect. These are recommended reporting windows, not automatic cut-offs for valid claims or statutory rights.
            </p>
            <p>
              Share your order number, affected items, a short description and photographs of the product, packaging and label where available. An unboxing video is helpful but is not mandatory. We will consider other reasonable evidence if photographs or original packaging are unavailable.
            </p>
            <p>
              Do not consume food you suspect is unsafe. Keep it separate and follow safe storage guidance while contacting us. You do not need to keep unsafe food where doing so would create a health risk; record the issue where practicable before disposal.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Refunds and replacements</h2>
            <p>
              We will review claims involving spoiled or unsafe food, expired products, damaged packaging affecting the product, incorrect items or cuts, missing items, short weight, or goods materially different from their description. Where the issue is confirmed, we will offer a refund for the affected amount or, with your agreement and subject to availability, a replacement at no extra delivery cost. Store credit will only be offered as an optional alternative.
            </p>
            <p>
              Fresh produce and fish naturally vary in appearance and size. Minor natural differences alone do not establish a defect, but the goods must still match the species, cut, quantity, quality and other characteristics agreed at purchase. Any gross-weight or cleaned-weight basis must be disclosed before purchase; we will review short-weight complaints against that stated basis.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Returns and exclusions</h2>
            <p>
              We do not accept change-of-mind returns of delivered perishable foods or opened food packages. A complaint will not be rejected simply because a package was opened to discover a defect. We may decline claims where the evidence shows the problem arose solely from improper storage or handling after a satisfactory delivery; we will explain our decision.
            </p>
            <p>
              Please do not send fresh food back without contacting us. We will arrange collection or provide safe disposal instructions where appropriate. For approved claims caused by our error or a product defect, we bear any required collection or return cost. A physical return is not always necessary.
            </p>
            <p>
              If a delivery fails because of an incorrect address or recipient unavailability, we will contact you to discuss safe redelivery and any charge before you agree to it. We will assess any refund using the actual circumstances and applicable law; there is no automatic forfeiture of the entire payment.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">6. Refund amount and payment method</h2>
            <p>
              Refunds reflect the amount actually paid for the affected items, including applicable tax and allocated discounts. For a whole-order cancellation or whole-order failure attributable to us, delivery and packing charges are also refunded. For a partial claim, we refund charges attributable to the affected items where applicable and explain the calculation. Unaffected delivered items remain payable.
            </p>
            <p>
              Approved refunds will be initiated within <strong>2 business days</strong>. Payment providers generally take a further <strong>5–7 business days</strong> to credit the amount, although actual processing time may vary. We will share confirmation and a transaction reference where available, and help trace a delayed refund. Any shorter legally required deadline takes priority.
            </p>
            <p>
              Prepaid refunds go to the original payment method wherever supported. For cash-on-delivery orders, we will arrange a bank or UPI refund to details you confirm. We will never ask for your OTP, UPI PIN, card PIN or banking password to process a refund. Duplicate or excess payments will be refunded after transaction verification.
            </p>
          </section>

          {/* Section 7: Support & Grievance */}
          <section className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">7. Support and grievance resolution</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-700">Customer Support:</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Mail size={13} className="text-emerald-800" /> support@rbnow.in</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Phone size={13} className="text-emerald-800" /> 6304076069</p>
                <p className="text-gray-500 font-medium">Support hours: 8 am – 8 pm IST</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-700">Grievance Officer:</p>
                <p className="font-bold text-gray-900">Mustafa Hussain</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Mail size={13} className="text-emerald-800" /> rbnow.in@gmail.com</p>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-200/60 text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-700 flex items-center gap-1"><MapPin size={13} className="text-emerald-800" /> Business Legal Address:</p>
              <p>SS Anandamayee Enterprises, 402 Srinivasa Residency, Plot 86/C Street No.1 Radhanagar, Rajendranagar, Rangareddy, Telangana 500086</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
