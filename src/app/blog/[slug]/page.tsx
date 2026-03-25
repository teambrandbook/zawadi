import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import BlogDetail from "@/components/blog/BlogDetail";
import { notFound } from "next/navigation";


const blogs = {
    "recipe-4": {
        title: "Every dish tells a story",
        description: "Explore the culinary journey behind our creations.",
        image: "/recipe/recipe-4.webp",
        content: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Exploring the heart of flavored journey. At the core of our creations is a love for fresh, seasonal ingredients and flavors that inspire. In this blog, we take you on a culinary journey, highlighting the unique flavors that excite the palate.",
            "Our chefs carefully craft each dish to ensure every bite is balanced, vibrant, and memorable. Whether it's a traditional recipe or a seasonal innovation, discover the stories that connect food, culture, and creativity in our kitchens.",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ]
    },
    "product-5": {
        title: "Sustainable farming and culture",
        description: "Highlighting the ingredients that make our dishes special.",
        image: "/product/product-5.webp",
        content: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Discover how we source the best local ingredients. Supporting local farmers and sustainable produce is at the heart of our culinary philosophy. Each ingredient is carefully selected at the peak of its flavor.",
            "Our commitment to quality extends to every aspect of our menu. From freshly baked items to top-quality meats and plant-based options, we celebrate the best of each season's harvest with dedication and care.",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ]
    },
    "recipe-2": {
        title: "The art of fresh seasoning",
        description: "The inspiration for our seasonal menus and stories.",
        image: "/recipe/recipe-2.webp",
        content: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Fresh herbs and spices bring our dishes to life. In this post, we share our favorite seasoning techniques that enhance natural flavors without overpowering them. Learn how to balance vibrant notes for that perfect finish.",
            "Culinary innovation starts with a single high-quality ingredient. We believe that simplicity is the ultimate sophistication, and by focusing on the purest seasonal flavors, we create memorable dining experiences for our guests.",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ]
    }
};

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
