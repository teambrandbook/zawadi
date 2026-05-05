import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Search } from "lucide-react";

export const blogImageOne =
  "https://www.figma.com/api/mcp/asset/0f3399c6-deed-4381-81d7-28b9cce3fa3b";
export const blogImageTwo =
  "https://www.figma.com/api/mcp/asset/774d5d2b-3f0f-4e4a-880c-528556cf4028";
export const blogImageThree =
  "https://www.figma.com/api/mcp/asset/1829f903-6117-4865-a37f-147501ca430e";

export const blogPosts = [
  {
    slug: "detail01",
    title: "WellLife for Everyday Living",
    description:
      "A journey into simple, mindful living where everyday choices feel lighter, cleaner, and more balanced. With Zewadi, healthy living isn't complicated; it's about embracing small habits, choosing better ingredients, and creating a lifestyle that feels natural, effortless, and truly your own.",
    image: blogImageOne,
    href: "/blog/detail01",
    date: "October 19, 2022",
  },
  {
    slug: "detail02",
    title: "NutriHub for Community & Growth",
    description:
      "More than just a space, NutriHub is a growing community centered around health, connection, and shared learning. It's where ideas, experiences, and everyday practices come together encouraging better habits, meaningful conversations, and a collective approach to living well.",
    image: blogImageTwo,
    href: "/blog/detail02",
    date: "October 19, 2022",
  },
  {
    slug: "detail03",
    title: "ZewTaste for Food & Experience",
    description:
      "Step into the world of Zewadi through thoughtfully crafted products, inspiring recipes, and real-life experiences. From simple meals to creative dishes, ZewTaste celebrates how food can be both refined and effortless bringing joy, flavor, and meaning into your everyday moments.",
    image: blogImageThree,
    href: "/blog/detail03",
    date: "October 19, 2022",
  },
];

const popularPosts = [
  {
    title: "Find Your Adventure Live Your Passion",
    date: "October 19, 2022",
    image: blogImageOne,
    href: "/blog/detail01",
  },
  {
    title: "Ravel Beyond Your Products",
    date: "October 19, 2022",
    image: blogImageTwo,
    href: "/blog/detail02",
  },
  {
    title: "Healthy Eating on a Budget",
    date: "October 19, 2022",
    image: blogImageThree,
    href: "/blog/detail03",
  },
];

export default function Blogs() {
  return (
    <div className="bg-white">
      <section className="bg-[#1f4d3a] pt-20 sm:pt-24 pb-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="h-[140px] sm:h-[180px]" />
          <div className="max-w-[440px] rounded-t-[24px] bg-white px-7 py-7 sm:px-10 sm:py-10 shadow-[0_-15px_60px_rgba(0,0,0,0.05)]">
            <h1 className="font-serif text-[2.25rem] font-bold leading-none text-[#0e2207] sm:text-[2.75rem]">
              Blogs
            </h1>
            <p className="mt-4 text-base font-bold text-[#1f6306] sm:text-lg">
              Zewadi Blogs
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 pt-10 sm:pb-24 sm:pt-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,850px)_340px] xl:gap-14">
            <div className="space-y-10 sm:space-y-12">
              {blogPosts.map((post) => (
                <article key={post.title} className="max-w-[850px]">
                  <div className="overflow-hidden rounded-[20px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-[220px] w-full object-cover sm:h-[280px] lg:h-[320px]"
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-[#111214]">
                    <CalendarDays size={14} className="text-[#1f4d3a]" />
                    <span className="font-sans">{post.date}</span>
                  </div>

                  <h2 className="mt-4 font-serif text-[1.5rem] leading-tight text-black sm:text-[2rem] sm:leading-[1.2]">
                    {post.title}
                  </h2>

                  <p className="mt-4 max-w-[95%] text-sm font-semibold leading-[1.625rem] text-[#727272]">
                    {post.description}
                  </p>

                  <Link
                    href={post.href}
                    className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#1f4d3a] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Learn More
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}

              <div className="flex items-center justify-center gap-3 pt-2">
                {[1, 2, 3].map((page, index) => (
                  <button
                    key={page}
                    type="button"
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-[5px] border text-lg font-bold transition-colors ${
                      index === 0
                        ? "border-[#1f4d3a] text-[#1f4d3a]"
                        : "border-[#e3dbd8] text-[#1f4d3a]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Next page"
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-[5px] border border-[#e3dbd8] text-[#1f4d3a] transition-colors hover:border-[#1f4d3a]"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[20px] bg-white p-5 shadow-[0_0_60px_rgba(0,0,0,0.05)]">
                <h3 className="text-xl font-bold leading-tight text-[#1f4d3a]">
                  Search Here
                </h3>
                <label className="mt-5 flex items-center rounded-full border border-[#e3dbd8] px-4 py-2 text-[#727272]">
                  <input
                    type="text"
                    placeholder="Search.."
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#b4b4b4]"
                  />
                  <Search size={16} className="text-[#1f4d3a]" />
                </label>
              </div>

              <div className="rounded-[20px] bg-white p-6 shadow-[0_0_60px_rgba(0,0,0,0.05)]">
                <h3 className="text-xl font-bold leading-tight text-[#1a4331]">
                  Popular Post
                </h3>
                <div className="mt-3 h-px w-full bg-[#e3dbd8]" />

                <div className="mt-5 space-y-4">
                  {popularPosts.map((post) => (
                    <Link
                      key={post.title}
                      href={post.href}
                      className="group flex items-center gap-4"
                    >
                      <div className="h-[65px] w-[65px] flex-shrink-0 rounded-[18px] bg-[#d9d9d9]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#727272]">
                          <CalendarDays size={13} className="text-[#1a4331]" />
                          {post.date}
                        </div>
                        <h4 className="mt-1 text-[15px] font-bold leading-snug text-[#1a4331] group-hover:text-[#1f6306]">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
