import Image from "next/image";

interface BlogData {
    title: string;
    description: string;
    image: string;
    content: string[];
}

interface BlogDetailProps {
    blog: BlogData;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
    return (
        <div className="w-full bg-white">
            <section className="pt-40 pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto flex flex-col items-center">
                    
                    {/* Title */}
                    <div className="text-center max-w-4xl mb-24">
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-none uppercase">
                            {blog.title}
                        </h1>
                    </div>

                    {/* Featured Image */}
                    <div className="w-full aspect-[21/9] relative rounded-none overflow-hidden shadow-2xl mb-24">
                        <Image 
                            src={blog.image} 
                            alt={blog.title} 
                            fill 
                            className="object-cover" 
                        />
                    </div>

                    {/* Blog Content */}
                    <div className="max-w-4xl mx-auto flex flex-col gap-10">
                        {blog.content.map((paragraph, idx) => (
                            <p key={idx} className="font-sans text-gray-700 text-lg md:text-xl leading-relaxed text-justify">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
}
