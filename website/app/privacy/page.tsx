import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Terms of Service | The Royal Bengal Fresh",
};

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif">Privacy Policy & Terms of Service</h1>
          <p className="mt-2 text-xs text-gray-500 font-medium">The Royal Bengal Fresh (Operated under SS Anandamayee Enterprises) | Effective date: 12 November 2026</p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-600">
          
          <p>
            This privacy policy and terms of service set out how <strong>The Royal Bengal Fresh</strong> (operated under <strong>SS Anandamayee Enterprises</strong>) uses and protects any information that you give when you use this website or mobile application.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Consent & Introduction</h2>
            <p>
              By using our platform (website, application, or services), you voluntarily agree to consent to and abide by this privacy policy and our terms of service. FSSAI Lic. No: <strong>23626028007758</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name and title.</li>
              <li>Contact information including email address and mobile number (6304076069).</li>
              <li>Demographic information such as postcode, delivery address, preferences, and location coordinates.</li>
              <li>Transaction history and order preferences.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Use of Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Order Fulfillment:</strong> To process, clean, pack, and deliver fresh fish, meat, and groceries accurately.</li>
              <li><strong>Customer Support:</strong> To communicate regarding order updates, delivery schedules, and support inquiries via WhatsApp and phone.</li>
              <li><strong>Promotional Offers:</strong> To send updates about seasonal catches, fresh arrivals, and promotional discounts.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Shipping & Delivery Terms</h2>
            <p>
              We provide temperature-controlled express delivery for perishable items. Delivery fees and slots are displayed at checkout. Customers are requested to inspect perishables promptly upon delivery.
            </p>
          </section>

          {/* Section 5: Contact & Grievance */}
          <section className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Grievance Officer & Business Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-700">Customer Support:</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Mail size={13} className="text-emerald-800" /> rbnow.in@gmail.com</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Phone size={13} className="text-emerald-800" /> 6304076069</p>
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
              <p className="font-bold text-amber-900 pt-1">FSSAI Lic. No: 23626028007758</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
