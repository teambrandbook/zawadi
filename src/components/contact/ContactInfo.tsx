
export default function ContactInfo() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card 1: Visit */}
                <div className="bg-[#EAE3D2] rounded-xl p-8 md:p-10 flex items-start gap-6 border border-[#0A4834]/10 transition-all duration-300 hover:bg-[#0A4834] group hover:shadow-xl">
                    <div className="w-12 h-12 bg-[#0A4834] group-hover:bg-white rounded-md flex items-center justify-center shrink-0 text-white group-hover:text-[#0A4834] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-[#0A4834] group-hover:text-white mb-2 transition-colors">Visit Our Bakery</h3>
                        <p className="font-sans text-[#555] group-hover:text-white/90 text-sm leading-relaxed transition-colors">
                            123 Sweet Street Cookie<br />
                            Valley, CA 90210 United<br />
                            States
                        </p>
                    </div>
                </div>

                {/* Card 2: Call */}
                <div className="bg-[#EAE3D2] rounded-xl p-8 md:p-10 flex items-start gap-6 border border-[#0A4834]/10 transition-all duration-300 hover:bg-[#0A4834] group hover:shadow-xl">
                    <div className="w-12 h-12 bg-[#0A4834] group-hover:bg-white rounded-md flex items-center justify-center shrink-0 text-white group-hover:text-[#0A4834] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-[#0A4834] group-hover:text-white mb-2 transition-colors">Call Us</h3>
                        <p className="font-sans text-[#555] group-hover:text-white/90 text-sm leading-relaxed transition-colors">
                            +1 (555) 123-COOKIE<br />
                            Mon-Fri: 8am-6pm PST<br />
                            Sat-Sun: 9am-5pm PST
                        </p>
                    </div>
                </div>

                {/* Card 3: Email */}
                <div className="bg-[#EAE3D2] rounded-xl p-8 md:p-10 flex items-start gap-6 border border-[#0A4834]/10 transition-all duration-300 hover:bg-[#0A4834] group hover:shadow-xl">
                    <div className="w-12 h-12 bg-[#0A4834] group-hover:bg-white rounded-md flex items-center justify-center shrink-0 text-white group-hover:text-[#0A4834] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-[#0A4834] group-hover:text-white mb-2 transition-colors">Email Us</h3>
                        <div className="font-sans text-[#555] group-hover:text-white/90 text-sm leading-relaxed flex flex-col transition-colors">
                            <a href="mailto:hello@crunchyco.com" className="hover:text-white font-medium transiton-all underline underline-offset-4 decoration-white/0 hover:decoration-white/50">hello@crunchyco.com</a>
                            <a href="mailto:orders@crunchyco.com" className="hover:text-white font-medium transiton-all underline underline-offset-4 decoration-white/0 hover:decoration-white/50">orders@crunchyco.com</a>
                            <a href="mailto:support@crunchyco.com" className="hover:text-white font-medium transiton-all underline underline-offset-4 decoration-white/0 hover:decoration-white/50">support@crunchyco.com</a>
                        </div>
                    </div>
                </div>

                {/* Card 4: Social */}
                <div className="bg-[#0A4834] rounded-xl p-8 md:p-10 flex flex-col justify-center gap-4 text-white transition-all duration-300 hover:shadow-xl hover:bg-[#1A5A44] border border-white/10 group">
                    <h3 className="font-display text-lg font-bold">Follow Our Cookie Journey</h3>

                    <div className="flex gap-4">
                        {/* Instagram */}
                        <a href="#" className="hover:text-[#D4A5A5] transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        {/* Facebook */}
                        <a href="#" className="hover:text-[#D4A5A5] transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        {/* Twitter */}
                        <a href="#" className="hover:text-[#D4A5A5] transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                        {/* TikTok (Music note rep) */}
                        <a href="#" className="hover:text-[#D4A5A5] transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18V5l12-2v13"></path>
                                <circle cx="6" cy="18" r="3"></circle>
                                <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                        </a>
                    </div>

                    <p className="font-sans text-white/70 text-xs leading-relaxed mt-2">
                        Get the latest updates on new flavors, special offers, and behind-the-scenes content from our bakery!
                    </p>
                </div>

            </div>
        </section>
    );
}
