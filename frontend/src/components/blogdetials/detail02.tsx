import BlogDetailTemplate from "./detail-template";

const image = "https://www.figma.com/api/mcp/asset/0349a2b3-c1ea-435f-8e58-e3a6b0418b84";

const popularPosts = [
  {
    title: "Find Your Adventure Live Your Passion",
    image:
      "https://www.figma.com/api/mcp/asset/fe0cb28a-0cc9-4662-bfb1-c3d5945d01ae",
  },
  {
    title: "Ravel Beyond Your Products",
    image:
      "https://www.figma.com/api/mcp/asset/f758013a-31b2-47b0-9d45-a8ece2a8d106",
  },
  {
    title: "Healthy Eating on a Budget",
    image:
      "https://www.figma.com/api/mcp/asset/8ba6b770-2207-46c8-b37e-7f90a5c28382",
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
