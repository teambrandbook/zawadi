import { type Recipe } from "@/components/recipes/recipeTypes";
import recipesData from "@/data/recipes.json";

function normalizeText(value: string) {
  return value
    .replaceAll("sautÃ©", "saute")
    .replaceAll("sautÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ed", "sauteed")
    .replaceAll("â€“", "-")
    .replaceAll("ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â", " - ");
}

function normalizeList(values?: string[]) {
  return values?.map(normalizeText);
}

export const recipes: Recipe[] = (recipesData as Recipe[]).map((recipe) => ({
  ...recipe,
  description: normalizeText(recipe.description),
  benefits: normalizeList(recipe.benefits),
  ingredients: normalizeList(recipe.ingredients),
  optional: normalizeList(recipe.optional),
  steps: normalizeList(recipe.steps),
}));

export function getRecipeById(id: string) {
  return recipes.find((recipe) => recipe.id === id);
}
