export type RecipeNutrition = {
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  benefits?: string[];
  image: string;
  categories: string[];
  nutrition?: RecipeNutrition;
  ingredients?: string[];
  optional?: string[];
  steps?: string[];
};
