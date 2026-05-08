import BlogDetailTemplate from "./detail-template";

const image = "https://www.figma.com/api/mcp/asset/63676847-0566-4f14-bf37-7df8e628f916";

const popularPosts = [
  {
    title: "Find Your Adventure Live Your Passion",
    image:
      "https://www.figma.com/api/mcp/asset/ddebec2a-6a57-471e-a86d-64d2bc7070db",
  },
  {
    title: "Ravel Beyond Your Products",
    image:
      "https://www.figma.com/api/mcp/asset/951c5080-d175-44c4-8f59-3e59e097d654",
  },
  {
    title: "Healthy Eating on a Budget",
    image:
      "https://www.figma.com/api/mcp/asset/a317b1ff-1f70-4678-a78e-fcb62ca859ba",
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
