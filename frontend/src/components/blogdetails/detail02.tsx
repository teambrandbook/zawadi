import BlogDetailTemplate from "./detail-template";

const image = "/blogs/blog-2.webp";

const popularPosts = [
  {
    title: "Find Your Adventure Live Your Passion",
    image:
      "/blogs/blog-1.webp",
    href: "/blogdetails/detail01",
  },
  {
    title: "Ravel Beyond Your Products",
    image:
      "/blogs/blog-2.webp",
    href: "/blogdetails/detail02",
  },
  {
    title: "Healthy Eating on a Budget",
    image:
      "/blogs/blog-3.webp",
    href: "/blogdetails/detail03",
  },
];

export default function Detail02() {
  return (
    <BlogDetailTemplate
      heroTitle="Blogs"
      heroSubtitle="Zewadi Blogs"
      image={image}
      title="NutriHub for Community & Growth"
      intro="More than just a space, NutriHub is a growing community centered around health, connection, and shared learning. It's where ideas, experiences, and everyday practices come together encouraging better habits, meaningful conversations, and a collective approach to living well."
      popularPosts={popularPosts}
    />
  );
}
