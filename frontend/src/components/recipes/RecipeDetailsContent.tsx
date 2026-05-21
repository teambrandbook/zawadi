"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Play, Utensils } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { fadeIn, imageAnimationtopdown } from "@/utils/animations";
import { type Recipe } from "@/components/recipes/recipeTypes";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import api, { getAccessToken } from "@/services/api";
import type { RootState } from "@/redux/store";

type FavoriteRecipeItem = {
  id?: number | string;
  recipe?: {
    id?: number | string;
  };
};

type FavoriteRecipesResponse =
  | FavoriteRecipeItem[]
  | {
      data?: FavoriteRecipeItem[];
      results?: FavoriteRecipeItem[];
    };

function favoriteListFromResponse(data: FavoriteRecipesResponse): FavoriteRecipeItem[] {
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.results)
    ? data.results
    : [];
}

export default function RecipeDetailsContent({
  recipe,
}: {
  recipe: Recipe;
}) {
  const { locale } = useLocale();
  const detailText = translations[locale]?.recipesPage?.detail || translations.en.recipesPage.detail;
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritePending, setFavoritePending] = useState(false);
  const ingredients = recipe.ingredients ?? [];
  const optionalIngredients = recipe.optional ?? [];
  const steps = recipe.steps ?? [];
  const nutrition = recipe.nutrition ?? {
    calories: "-",
    fat: "-",
    carbs: "-",
    protein: "-",
  };
  const formatText = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce(
      (text, [key, value]) => text.replace(`{${key}}`, String(value)),
      template
    );

  useEffect(() => {
    imageAnimationtopdown(".recipe-detail-image-topdown");
    fadeIn(".fade-in")
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !getAccessToken()) {
      setIsFavorite(false);
      return;
    }

    let mounted = true;

    api
      .get<FavoriteRecipesResponse>("/recipes/favorites/")
      .then(({ data }) => {
        if (!mounted) return;

        const favoriteRecipeIds = favoriteListFromResponse(data).map((item) =>
          String(item.recipe?.id ?? item.id)
        );
        setIsFavorite(favoriteRecipeIds.includes(recipe.id));
      })
      .catch(() => {
        if (mounted) setIsFavorite(false);
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, recipe.id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated && !getAccessToken()) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (favoritePending) return;

    const nextValue = !isFavorite;
    setIsFavorite(nextValue);
    setFavoritePending(true);

    try {
      if (nextValue) {
        await api.post(`/recipes/${recipe.id}/favorite/`);
        toast.success(detailText.saved);
      } else {
        await api.delete(`/recipes/${recipe.id}/favorite/`);
        toast.success(detailText.removed);
      }
    } catch {
      setIsFavorite(!nextValue);
      toast.error(detailText.favoriteError);
    } finally {
      setFavoritePending(false);
    }
  };

  return (
    <main className="bg-[#fffef5] text-[#0e2207]">
      {/* <ContentSection
        title="Zewadi Recipes"
        subtitle="Delicious Zewadi Buckwheat Recipes"
      /> */}

      <section className="px-4 pb-12 pt-8 sm:px-6 md:pb-24 md:pt-16 lg:px-0">
        <div className="mx-auto max-w-[1190px]">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start lg:gap-10 xl:grid-cols-[450px_1fr] xl:gap-[100px]">
            <div className="recipe-detail-image-topdown relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[12px] xl:max-w-[450px]">
              <div className="relative aspect-[4/5] sm:aspect-[450/540]">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              </div>

              {recipe.videoUrl ? (
                <a
                  href={recipe.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={formatText(detailText.watchVideo, { title: recipe.title })}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#1f4d3a] shadow-lg transition-transform hover:scale-105 md:h-[62px] md:w-[62px]">
                    <Play className="h-5 w-5 fill-white text-white ltr:ml-0.5 rtl:mr-0.5 md:h-6 md:w-6 md:ltr:ml-1 md:rtl:mr-1" />
                  </span>
                </a>
              ) : null}

              <button
                type="button"
                aria-label={
                  isFavorite
                    ? formatText(detailText.removeFavorite, { title: recipe.title })
                    : formatText(detailText.addFavorite, { title: recipe.title })
                }
                aria-pressed={isFavorite}
                disabled={favoritePending}
                onClick={handleToggleFavorite}
                className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1f4d3a] shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 rtl:left-auto rtl:right-4"
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-200 ${
                    isFavorite
                      ? "fill-[#1f4d3a] stroke-[#1f4d3a]"
                      : "fill-transparent stroke-[#1f4d3a]"
                  }`}
                />
              </button>
            </div>

            <div className="pt-1 text-left rtl:text-right">
              <h2 className="fade-in font-['Playfair_Display'] text-[28px] font-bold uppercase leading-tight text-black sm:text-[36px] md:text-[46px]">
                {recipe.title}
              </h2>

              <p className="fade-in mt-4 font-['DM_Sans'] text-[15px] font-medium leading-relaxed text-[#1f4d3a] md:text-[16px]">
                {recipe.description}
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-[170px_1fr]">
                <div className="h-fit rounded-[10px] bg-[#1f4d3a] px-4 py-5">
                  <h3 className="mb-4 font-['Playfair_Display'] text-[14px] font-semibold text-white">
                    {detailText.nutritionFacts}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                    {[
                      { label: detailText.calories, val: nutrition.calories },
                      { label: detailText.fat, val: nutrition.fat },
                      { label: detailText.carbs, val: nutrition.carbs },
                      { label: detailText.protein, val: nutrition.protein },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[6px] bg-white px-2 py-3 text-center font-['DM_Sans'] text-[12px] font-bold leading-none text-black"
                      >
                        {item.val} {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {ingredients.length > 0 ? (
                  <div className="w-full rounded-[4px] border-2 border-dashed border-[#6d8f81] bg-white px-5 py-5 md:min-h-[240px]">
                    <div className="mb-3 flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                      <div className="text-[#1f4d3a]">
                        <Utensils size={14} />
                      </div>
                      <h3 className="font-['DM_Sans'] text-[13px] font-semibold tracking-wider text-black">
                        {detailText.ingredients}
                      </h3>
                    </div>

                    <ul className="list-disc space-y-2 pl-4 font-['DM_Sans'] text-[14px] font-medium leading-snug text-[#1f4d3a] rtl:pl-0 rtl:pr-4 md:text-[13px]">
                      {ingredients.map((item, idx) => (
                        <li key={idx} className="pl-1 rtl:pl-0 rtl:pr-1">
                          {item}
                        </li>
                      ))}
                    </ul>

                    {optionalIngredients.length > 0 ? (
                      <p className="mt-5 font-['DM_Sans'] text-[14px] font-medium leading-snug text-[#1f4d3a] md:text-[13px]">
                        <span className="font-bold">Optional:</span>{" "}
                        {optionalIngredients.join(", ")}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {steps.length > 0 ? (
            <div className="fade-in mt-12 rounded-[6px] bg-[#f4f6ed] px-5 py-8 text-left rtl:text-right sm:px-8 sm:py-10 md:mt-16 lg:mt-20 lg:px-[76px] lg:py-12">
              <h3 className="mb-6 font-['Playfair_Display'] text-[26px] font-bold text-[#1f4d3a] md:mb-8 md:text-[36px]">
                {detailText.howToCook}
              </h3>

              <div className="space-y-6 md:space-y-7">
                {steps.map((step, index) => (
                  <div
                    key={`${recipe.id}-step-${index + 1}`}
                    className="max-w-[900px] font-['DM_Sans'] text-[15px] leading-relaxed text-[#496456]"
                  >
                    <span className="font-extrabold text-[#1f4d3a]">
                      {formatText(detailText.step, { count: index + 1 })}
                    </span>{" "}
                    <span className="font-normal">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
