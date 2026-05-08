import BlogDetailTemplate from "./detail-template";

const image = "https://www.figma.com/api/mcp/asset/a03eae76-3977-4853-b2c9-0c92085baa47";

const popularPosts = [
  {
    title: "Find Your Adventure Live Your Passion",
    image:
      "https://www.figma.com/api/mcp/asset/c4dbba35-adcd-4df8-ab16-851f1c8715ba",
  },
  {
    title: "Ravel Beyond Your Products",
    image:
      "https://www.figma.com/api/mcp/asset/e1da7d73-ad5c-40f4-a900-9ca6b6c9eab8",
  },
  {
    title: "Healthy Eating on a Budget",
    image:
      "https://www.figma.com/api/mcp/asset/336db613-9f10-44fb-b77f-a21310e7dac4",
  },
];

export default function Detail01() {
  return (
    <BlogDetailTemplate
      heroTitle="Blogs"
      heroSubtitle="Zewadi Blogs"
      image={image}
      title="WellLife for Everyday Living"
      intro="A journey into simple, mindful living where everyday choices feel lighter, cleaner, and more balanced. With Zewadi, healthy living isn't complicated; it's about embracing small habits, choosing better ingredients, and creating a lifestyle that feels natural, effortless, and truly your own."
      popularPosts={popularPosts}
    />
  );
}
