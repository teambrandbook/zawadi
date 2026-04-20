import Questions from "../faq/Questions";

export default function FAQ() {
    return (
        <section className="w-full bg-white  px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Header Section */}
                <div className="text-center max-w-4xl mb-16 flex flex-col gap-6">
                    <h2 className="font-display text-3xl md:text-4xl lg:text-6xl font-light text-[#0A4834] mb-8 tracking-tight leading-none">
                        Quick Answers to Common Questions
                    </h2>
                    <p className="font-mulish text-[#3A6B56] text-sm md:text-lg leading-relaxed max-w-3xl mx-auto">
                        At Zewadi, we believe in clarity and connection. Explore our most frequently asked questions to learn more about our commitment to quality, community, and your wellness journey.
                    </p>
                </div>

                <Questions/>

            </div>
        </section>
    );
}
