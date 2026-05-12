import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

const supportSections = [
  {
    title: "Account Help",
    body: "If you are having trouble signing in, creating an account, or updating your profile, check that your email and password are correct and try resetting your password if needed.",
  },
  {
    title: "Orders and Payments",
    body: "For product orders, payment questions, delivery updates, or order changes, keep your order details ready so our support team can help you faster.",
  },
  {
    title: "Consultations",
    body: "For booking, rescheduling, or consultation-related support, please include the consultation date, consultant name, and any relevant booking information.",
  },
  {
    title: "Community Features",
    body: "If you need help with recipes, blogs, events, or community dashboard features, describe the page and action where the issue happened.",
  },
  {
    title: "Technical Issues",
    body: "If something is not loading or working correctly, try refreshing the page. If the issue continues, share your browser, device, and a short description of the problem.",
  },
  {
    title: "Contact Support",
    body: "For direct help, contact the Zewadi support team with your name, email address, and a clear explanation of what you need help with.",
  },
];

export default function HelpAndSupportPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#1f2937]">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <section className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9f8151]">
            Help &amp; Support
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0a4833] sm:text-5xl">
            We are here to help
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#4b5563]">
            Find quick guidance for common account, order, payment,
            consultation, and community support questions.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-4xl space-y-8">
          {supportSections.map((section) => (
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
