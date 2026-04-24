
export default function ContactInfo() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card 1: Visit */}
                <div className="bg-[#274836] rounded-xl p-8 md:p-10 flex items-start gap-6 border-none">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0 text-[#274836]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-akatab text-base font-semibold text-white mb-4">Visit Our Bakery</h3>
                        <p className="font-akatab text-white/80 text-sm leading-relaxed">
                            123 Sweet Street Cookie<br />
                            Valley, CA 90210 United<br />
                            States
                        </p>
                    </div>
                </div>

                {/* Card 2: Call */}
                <div className="bg-[#274836] rounded-xl p-8 md:p-10 flex items-start gap-6 border-none">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0 text-[#274836]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-akatab text-base font-semibold text-white mb-4">Call Us</h3>
                        <p className="font-akatab text-white/80 text-sm leading-relaxed">
                            +1 (555) 123-COOKIE<br />
                            Mon-Fri: 8am-6pm PST<br />
                            Sat-Sun: 9am-5pm PST
                        </p>
                    </div>
                </div>

                {/* Card 3: Email */}
                <div className="bg-[#274836] rounded-xl p-8 md:p-10 flex items-start gap-6 border-none">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0 text-[#274836]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-akatab text-base font-semibold text-white mb-4">Email Us</h3>
                        <div className="font-akatab text-white/80 text-sm leading-relaxed flex flex-col">
                            <a href="mailto:hello@crunchyco.com" className="hover:text-white font-medium transiton-all underline underline-offset-4 decoration-white/0 hover:decoration-white/50">hello@crunchyco.com</a>
                            <a href="mailto:orders@crunchyco.com" className="hover:text-white font-medium transiton-all underline underline-offset-4 decoration-white/0 hover:decoration-white/50">orders@crunchyco.com</a>
                            <a href="mailto:support@crunchyco.com" className="hover:text-white font-medium transiton-all underline underline-offset-4 decoration-white/0 hover:decoration-white/50">support@crunchyco.com</a>
                        </div>
                    </div>
                </div>

                {/* Card 4: Social */}
                <div className="bg-[#274836] rounded-xl p-8 md:p-10 flex flex-col justify-center gap-4 text-white border-none">
                    <h3 className="font-akatab text-base font-semibold text-white mb-4">Follow Our Cookie Journey</h3>

                    <div className="flex gap-4">
                        {/* Instagram */}
                        <a href="#" className="hover:opacity-70 transition-opacity text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        {/* Facebook */}
                        <a href="#" className="hover:opacity-70 transition-opacity text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        {/* X */}
                        <a href="#" className="hover:opacity-70 transition-opacity text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                            </svg>
                        </a>
                        {/* TikTok */}
                        <a href="#" className="hover:opacity-70 transition-opacity text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                            </svg>
                        </a>
                    </div>

                    <p className="font-inter text-white/70 text-xs leading-relaxed mt-2">
                        Get the latest updates on new flavors, special offers, and behind-the-scenes content from our bakery!
                    </p>
                </div>

            </div>
        </section>
    );
}
