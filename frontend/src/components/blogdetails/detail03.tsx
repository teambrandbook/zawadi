import BlogDetailTemplate from "./detail-template";

const image = "/blogs/blog-3.webp";

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

export default function Detail03() {
  return (
    <BlogDetailTemplate
      heroTitle="Blogs"
      heroSubtitle="Zewadi Blogs"
      image={image}
      title="ZewTaste for Food & Experience"
      intro="A journey into simple, mindful living where everyday choices feel lighter, cleaner, and more balanced. With Zewadi, healthy living isn't complicated; it's about embracing small habits, choosing better ingredients, and creating a lifestyle that feels natural, effortless, and truly your own."
      popularPosts={popularPosts}
    />
  );
}
