import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { recipeIngredientService } from '../services/recipe.ingredient.service';
import { recipePreparingService } from '../services/recipe.preparing.service';
import { recipeService } from '../services/recipe.service';
import { recipeData, recipeIngredientsData, recipePreparingData } from '../recipeData';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
  @Input()
  currentRecipeIndex: number;

  @Output()
  intoHomePage: EventEmitter<boolean> = new EventEmitter<boolean>();

  recipe: recipeData;
  recipeIngredients: recipeIngredientsData[];
  recipePreparings: recipePreparingData[];

  ingredientExample: recipeIngredientsData = { recipeId: 3, quantity: '1 tsp', ingredient: 'Worcestershire sauce' }
  preparingExample: recipePreparingData = { recipeId: 3, stepNumber: 5, step: 'Add chopped anchovy fillets and garlic, lemon juice, Worcestershire sauce, mustard, white balsamic vinegar, and sugar to the egg yolk and mix with a hand blender.' }

  constructor(public recipeService: recipeService, public recipeIngredientService: recipeIngredientService, public recipePreparingService: recipePreparingService) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipe = recipes.find(recipe => recipe.recipeId === this.currentRecipeIndex);
    });
    this.recipeIngredientService.getRecipeIngredients().subscribe(recipeIngredients => {
      this.recipeIngredients = recipeIngredients.filter(ingredients => ingredients.recipeId === this.currentRecipeIndex);
      this.recipeIngredients.sort();
    });
    this.recipePreparingService.getRecipePreparings().subscribe(recipePreparings => {
      // tslint:disable-next-line: max-line-length
      this.recipePreparings = recipePreparings.filter(preparings => preparings.recipeId === this.currentRecipeIndex);
      this.recipePreparings.sort((a, b) => a.stepNumber - b.stepNumber);
    });
    // this.recipeIngredientService.addRecipeIngredient(this.ingredientExample);
    // this.recipePreparingService.addRecipePreparing(this.preparingExample);
  }
  getRecipeImage = (): string => {
    if (this.recipe) {
      return this.recipe.image;
    }
  }
  getRecipeTime = (): string => {
    if (this.recipe) {
      return this.recipe.time;
    }
  }
  getRecipeTitle = (): string => {
    if (this.recipe) {
      return this.recipe.title;
    }
  }
  getRecipeDescription = (): string => {
    if (this.recipe) {
      return this.recipe.description;
    }
  }
  deleteRecipe = () => {
    this.intoHomePage.emit(true);
    this.recipeService.deleteRecipe(this.recipe);
    this.recipeIngredientService.deleteRecipeIngredient(this.recipeIngredients);
    this.recipePreparingService.deleteRecipePreparing(this.recipePreparings);
  }
}
