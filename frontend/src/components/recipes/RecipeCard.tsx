import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle, Heart } from "lucide-react";
import { type Recipe } from "@/components/recipes/recipeTypes";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  toggleFavorite: () => void;
  reverse?: boolean;
}

export default function RecipeCard({
  recipe,
  isFavorite,
  toggleFavorite,
  reverse = false,
}: RecipeCardProps) {
  const benefits = recipe.benefits ?? [];

  return (
    <article
      className={`recipe-card grid min-h-screen origin-top items-start gap-10 bg-[#fffef5] px-4 pt-10 sm:px-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-[180px] lg:px-20 lg:pt-20
      ${
        reverse
          ? "lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1"
          : ""
      }`}
    >
      {/* Image Section */}
      <div className="relative mx-auto h-[360px] w-full max-w-[380px] overflow-hidden rounded-[16px] sm:h-[420px]">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
        />

        {/* Video Button */}
        {recipe.videoUrl ? (
          <a
            href={recipe.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch video for ${recipe.title}`}
            className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1f4d3a] text-white shadow-lg transition hover:scale-105 hover:bg-[#163a2b]"
          >
            <PlayCircle className="h-5 w-5" />
          </a>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="max-w-[500px]">
        {/* Title */}
        <h2 className="font-[600] text-[28px] leading-[36px] text-black md:text-[40px] md:leading-[48px] [font-family:'Playfair_Display']">
          {recipe.title}
        </h2>

        {/* Description */}
        <p className="mt-4 text-[13px] font-[500] leading-[1.7] text-[#1F4D3A] md:text-[15px] [font-family:'Inter']">
          {recipe.description}
        </p>

        {/* Benefits */}
        {benefits.length > 0 && (
          <>
            <h3 className="mt-5 text-[15px] font-[800] text-black md:text-[17px] [font-family:'Inter']">
              Benefits
            </h3>

            <ul className="mt-2 list-disc space-y-2 pl-5 text-[13px] font-[500] leading-[1.6] text-[#1F4D3A] md:text-[15px] [font-family:'Inter']">
              {benefits.map((benefit: string) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </>
        )}

        {/* Action Row: Learn More & Favorite */}
        <div className="mt-6 flex items-center gap-15">
          <Link
            href={`/recipes/${recipe.id}`}
            className="relative inline-flex items-center rounded-full bg-[#1f4d3a] py-4 pl-6 pr-16 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#163a2b]"
          >
            <span>Learn More</span>

            <span className="absolute right-[-18px] flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-white bg-[#1f4d3a]">
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
          </Link>

          <button
            type="button"
            aria-label={isFavorite ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
            aria-pressed={isFavorite}
            onClick={toggleFavorite}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f4d3a] text-white transition hover:bg-[#163a2b]"
          >
            <Heart
              className={`h-5 w-5 transition-all duration-200 ${
                isFavorite
                  ? "fill-white stroke-white"
                  : "stroke-white fill-transparent"
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
