
export default function StoryGrid() {
    const stories = [
        { id: "01", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { id: "02", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { id: "03", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { id: "04", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    ];

    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Title */}
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-black text-center mb-16 md:mb-20 tracking-tight leading-[0.9]">
                    The story behind the <br /> flavors
                </h2>

                {/* Grid Container */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {stories.map((story) => (
                        <div key={story.id} className="bg-[#9F8151] p-8 md:p-12 flex gap-8 md:gap-12 items-start rounded-sm">
                            {/* Number */}
                            <span className="font-display text-6xl md:text-7xl font-bold text-white tracking-tighter leading-none">
                                {story.id}
                            </span>

                            {/* Text Content */}
                            <div className="flex flex-col gap-3 pt-2">
                                <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                                    {story.title}
                                </h3>
                                <p className="font-sans text-white/90 text-sm md:text-base leading-relaxed">
                                    {story.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
