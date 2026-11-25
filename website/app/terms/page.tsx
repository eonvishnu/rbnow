import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service | The Royal Bengal Fresh",
};

export default function TermsOfServicePage() {
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
            <FileText size={14} className="text-emerald-700" /> Legal Agreement
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif">Terms of Service</h1>
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
            <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or transacting on <strong>The Royal Bengal Fresh</strong> (website, mobile application, or progressive web app), you agree to be bound by these Terms of Service. You must be at least 18 years of age and possess the legal authority to enter into binding contracts under Indian law.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. User Accounts &amp; Security</h2>
            <p>
              Users are responsible for maintaining the strict confidentiality of their account credentials, OTP verifications, and session tokens. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts, cancel orders, or restrict access at our sole discretion for security violations or fraudulent activity.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Pricing, Payments &amp; Intellectual Property</h2>
            <p>
              All prices listed on the platform are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise. Payments are processed securely via PCI-DSS compliant payment gateways (Razorpay). We do not store your complete credit card numbers or UPI PINs on our servers.
            </p>
            <p>
              All content, branding, logos, graphics, software, and text on this platform are the exclusive intellectual property of SS Anandamayee Enterprises and protected under Indian copyright and trademark laws. Unauthorized reproduction or scraping is strictly prohibited.
            </p>
          </section>

          {/* Section 4: Contact */}
          <section className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Legal Contact &amp; Support</h2>

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
