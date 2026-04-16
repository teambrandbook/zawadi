import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Recipe {
  id: number
  title: string
  short_description: string
  category: string
  difficulty_level: string
  prep_time_minutes: number
  cooking_time_minutes: number
  servings: number
  cover_image: string | null
  status: string
  created_at: string
}

interface RecipeState {
  recipes: Recipe[]
  loading: boolean
  error: string | null
}

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
}

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipesLoading(state) {
      state.loading = true
      state.error = null
    },
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.recipes = action.payload
      state.loading = false
    },
    addRecipe(state, action: PayloadAction<Recipe>) {
      state.recipes.unshift(action.payload)
    },
    setRecipesError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setRecipesLoading, setRecipes, addRecipe, setRecipesError } = recipeSlice.actions
export default recipeSlice.reducer
