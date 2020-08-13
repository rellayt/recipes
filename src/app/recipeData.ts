export interface RecipeData {
  recipeId: number;
  title: string;
  time: string;
  description: string;
  image?: string;
  idSource?: string;
}
export interface RecipeIngredientsData {
  recipeId: number;
  quantity: string;
  ingredient: string;
  idSource?: string;
}
export interface RecipePreparingData {
  recipeId: number;
  stepNumber: number;
  step: string;
  idSource?: string;
}
