import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import BlogDetail from "@/components/blog/BlogDetail";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const res = await fetch(`${API_BASE}/blog/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) notFound();

    const blog = await res.json();

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <BlogDetail blog={blog} />
            <Footer />
        </main>
    );
}
