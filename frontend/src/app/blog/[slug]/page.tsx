import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import BlogDetail from "@/components/blog/BlogDetail";
import { notFound } from "next/navigation";
import { blogs } from "../../../../lib/datafile"



export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = blogs[slug as keyof typeof blogs];

    if (!blog) {
        notFound();
    }

    

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <BlogDetail blog={blog} />
            <Footer />
        </main>
    );
}
