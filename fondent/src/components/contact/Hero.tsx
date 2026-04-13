
export default function Hero() {
    return (
        <section className="mx-6 md:mx-12 lg:mx-24 rounded-3xl bg-[#EAE3D2] mt-44 py-24 px-8 md:px-24 lg:px-64 flex items-center justify-center">

            {/* Form Container Card */}
            <div className="w-full max-w-3xl bg-[#0A4834] rounded-xl p-8 md:p-12 shadow-2xl">

                {/* Header */}
                <div className="flex flex-col gap-2 mb-10">
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Send Us a Message
                    </h1>
                    <p className="font-sans text-white/70 text-sm md:text-base font-light">
                        Fill out the form below and well get back to you within 24 hours
                    </p>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-6">

                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="firstName" className="text-white text-xs font-medium uppercase tracking-wider">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="John"
                                className="w-full h-12 px-4 rounded-md bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="lastName" className="text-white text-xs font-medium uppercase tracking-wider">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Doe"
                                className="w-full h-12 px-4 rounded-md bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-white text-xs font-medium uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="john@example.com"
                            className="w-full h-12 px-4 rounded-md bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]"
                        />
                    </div>

                    {/* Subject (Select) */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="subject" className="text-white text-xs font-medium uppercase tracking-wider">
                            Subject
                        </label>
                        <div className="relative">
                            <select
                                id="subject"
                                className="w-full h-12 px-4 rounded-md bg-white text-black appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]"
                                defaultValue="General Inquiry"
                            >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Product Support">Product Support</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Other">Other</option>
                            </select>
                            {/* Custom arrow icon */}
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-white text-xs font-medium uppercase tracking-wider">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            placeholder="Tell us how we can help you..."
                            className="w-full p-4 rounded-md bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A5A5] resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full h-12 mt-2 bg-[#E5E5E5] hover:bg-white text-[#2F4848] font-bold rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45 translate-y-[1px]">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                </form>

            </div>
        </section>
    );
}
