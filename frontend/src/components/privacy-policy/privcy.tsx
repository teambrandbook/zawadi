import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

const policySections = [
  {
    title: "Information We Collect",
    body: "We collect the details you provide when creating an account, placing orders, booking consultations, submitting recipes, or contacting Zewadi. This may include your name, email address, phone number, delivery information, preferences, and account activity.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information helps us provide account access, process orders, manage bookings, improve our services, respond to support requests, and personalize your experience across the Zewadi platform.",
  },
  {
    title: "Data Sharing",
    body: "We do not sell your personal information. We may share limited details with trusted service providers when needed for payments, delivery, analytics, communication, or legal compliance.",
  },
  {
    title: "Security",
    body: "We use reasonable safeguards to protect your data. However, no online service can guarantee complete security, so we encourage you to keep your login details private and use a strong password.",
  },
  {
    title: "Your Choices",
    body: "You may update your account details, manage communication preferences, or contact us to request help with your personal information.",
  },
  {
    title: "Contact Us",
    body: "If you have questions about this Privacy Policy or how your information is handled, please contact the Zewadi support team.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#1f2937]">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <section className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9f8151]">
            Privacy Policy
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0a4833] sm:text-5xl">
            Your privacy matters to us
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#4b5563]">
            This Privacy Policy explains how Zewadi collects, uses, and protects
            information when you use our website, community features, products,
            and consultation services.
          </p>
          <p className="mt-3 text-sm font-medium text-[#6b7280]">
            Last updated: May 11, 2026
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-4xl space-y-8">
          {policySections.map((section) => (
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
