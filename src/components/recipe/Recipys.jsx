import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { recipyButtonAnimation } from "../../../lib/animations";

const recipes = [
  {
    slug: "buckwheat-soup",
    title: "BUCKWHEAT SOUP",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/product/product-5.webp",
    benefits: [
      "Only the finest local ingredients",
      "Healthy & chemical-free",
      "Supports local farmers",
      "Peak flavor selection",
    ],
  },
  {
    slug: "buckwheat-salad",
    title: "BUCKWHEAT & VEG SALAD",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/recipe/recipe-2.webp",
    benefits: [
      "Fresh seasonal ingredients",
      "Healthy & chemical-free",
      "Supports local farmers",
      "Peak flavor selection",
    ],
  },
  {
    slug: "blueberry-dessert",
    title: "BUCKWHEAT & BLUEBERRY",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/recipe/recipe-3.webp",
    benefits: [
      "Fresh seasonal ingredients",
      "Healthy & chemical-free",
      "Supports local farmers",
      "Peak flavor selection",
    ],
  },
  {
    slug: "upma-special",
    title: "BUCKWHEAT UPMA",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/recipe/recipe-4.webp",
    benefits: [
      "Fresh seasonal ingredients",
      "Healthy & chemical-free",
      "Supports local farmers",
      "Peak flavor selection",
    ],
  },
];


export default function Recipys() {
  useEffect(() => {
    recipyButtonAnimation(".recipe-btn-wrap");
  }, []);

  return (
    <>
      {recipes.map((recipe, i) => (
        <section key={recipe.slug} className="relative w-full bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="img object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col">

                <h1 className="font-display text-5xl md:text-6xl font-black text-black uppercase tracking-tight leading-none mb-6">
                  {recipe.title}
                </h1>

                <p className="font-sans text-[#555] text-base leading-relaxed mb-8">
                  {recipe.description}
                </p>

                {/* Benefits */}
                <div className="mb-10">
                  <h3 className="font-display text-lg font-bold text-black mb-4">
                    Benefits
                  </h3>
                  <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-[#555] text-sm md:text-base leading-relaxed">
                    {recipe.benefits.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="recipe-btn-wrap mt-4 flex items-center gap-6">
                  <Link
                    href={`/recipe/${recipe.slug}`}
                    className="detail-btn flex h-14 w-0 overflow-hidden rounded-full bg-[#0A4834] text-white shadow-sm transition-colors hover:bg-[#1A5A44] md:h-16"
                  >
                    <span className="whitespace-nowrap px-6 font-sans text-sm font-bold uppercase tracking-widest flex items-center">
                      View Detail
                    </span>
                  </Link>

                  <Link
                    href={`/recipe/${recipe.slug}`}
                    className="arrow-btn flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#0A4834] text-white shadow-md transition-colors hover:bg-[#1A5A44]"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>
      ))}
    </>
  );
}