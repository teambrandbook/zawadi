import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

const termsSections = [
  {
    title: "Use of Zewadi",
    body: "By using Zewadi, you agree to use our website, products, community features, and consultation services only for lawful and appropriate purposes. You are responsible for the information you provide and for keeping your account details accurate.",
  },
  {
    title: "Accounts and Security",
    body: "You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Please notify us if you believe your account has been accessed without permission.",
  },
  {
    title: "Orders and Payments",
    body: "Product availability, pricing, delivery timelines, and payment processing may vary. Orders are confirmed only after successful payment or acceptance through the applicable checkout flow.",
  },
  {
    title: "Consultations and Content",
    body: "Consultation, wellness, recipe, and community content is provided for general support and should not replace professional medical advice. Always consult a qualified healthcare provider for medical concerns.",
  },
  {
    title: "Cancellations and Changes",
    body: "We may update, suspend, or discontinue parts of the platform when needed. Cancellation, refund, and rescheduling options may depend on the product, service, or booking type.",
  },
  {
    title: "Limitation of Liability",
    body: "Zewadi is provided on an as-available basis. To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential losses arising from your use of the platform.",
  },
  {
    title: "Contact Us",
    body: "If you have questions about these Terms & Conditions, please contact the Zewadi support team.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#1f2937]">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <section className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9f8151]">
            Terms &amp; Conditions
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0a4833] sm:text-5xl">
            Terms for using Zewadi
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#4b5563]">
            These Terms &amp; Conditions explain the basic rules for using the
            Zewadi website, account features, products, community tools, and
            consultation services.
          </p>
          <p className="mt-3 text-sm font-medium text-[#6b7280]">
            Last updated: May 11, 2026
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-4xl space-y-8">
          {termsSections.map((section) => (
            <article
              key={section.title}
              className="border-b border-[#0a4833]/10 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-[#0a4833]">
                {section.title}
              </h2>
              <p className="mt-3 text-base leading-8 text-[#4b5563]">
                {section.body}
              </p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
