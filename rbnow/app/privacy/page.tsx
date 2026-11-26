import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Lock, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | The Royal Bengal Fresh",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={14} className="text-emerald-700" /> Data Protection &amp; Security
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif">Privacy Policy</h1>
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
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Lock size={20} className="text-emerald-800" /> 1. Information We Collect
            </h2>
            <p>
              In compliance with the Information Technology Act, 2000 and applicable data protection regulations, <strong>The Royal Bengal Fresh</strong> collects personal information when you browse our platform, create an account, or place an order:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal Identifiers:</strong> Full name, verified mobile number, and email address.</li>
              <li><strong>Delivery &amp; Location Data:</strong> Exact GPS location coordinates (latitude &amp; longitude), street addresses, house numbers, and delivery pincodes.</li>
              <li><strong>Transaction Records:</strong> Order history, item preferences, and invoice records.</li>
              <li><strong>Device &amp; Usage Metadata:</strong> Browser type, IP address, session tokens, and security audit logs.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Use of Information &amp; Data Security</h2>
            <p>Your personal data is utilized strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Order Fulfillment:</strong> Processing, cleaning, temperature-packing, and dispatching fresh perishable goods to your exact GPS location.</li>
              <li><strong>Customer Communication:</strong> Sending order confirmations, dispatch alerts, OTP verification, and WhatsApp/SMS delivery updates.</li>
              <li><strong>Third-Party Logistics Sharing:</strong> Sharing necessary delivery details (recipient name, phone number, and delivery address/coordinates) with trusted logistics partners (such as Rapido, Porter, Uber, Dunzo) strictly to deliver your order. We <strong>never sell</strong> customer data.</li>
              <li><strong>Platform Security:</strong> Preventing fraudulent transactions and securing administrative sessions.</li>
            </ul>
            <p>
              We implement industry-standard encryption in transit (HTTPS/SSL) and secure database encryption and strict access controls to safeguard your personal data against unauthorized access, alteration, or disclosure.
            </p>
          </section>

          {/* Section 3: Grievance Redressal */}
          <section className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 uppercase tracking-tight flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-800" /> 3. Grievance Officer &amp; Privacy Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-700">Customer Support &amp; Privacy Desk:</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Mail size={13} className="text-emerald-800" /> care@rbnow.in</p>
                <p className="flex items-center gap-1.5 text-gray-900"><Phone size={13} className="text-emerald-800" /> 6304076069</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-700">Appointed Grievance Officer:</p>
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
