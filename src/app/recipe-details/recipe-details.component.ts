import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { recipeIngredientService } from '../services/recipe.ingredient.service';
import { recipePreparingService } from '../services/recipe.preparing.service';
import { recipeService } from '../services/recipe.service';
import { RecipeData, RecipeIngredientsData, RecipePreparingData } from '../recipeData';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
  // Variable represents the id of the recipe which is selected by user
  @Input()
  selectedRecipeID: number;

  // Variable which emits information about going to the home page
  @Output()
  intoHomePage: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Variables that store data from firebase
  recipe: RecipeData;
  recipeIngredients: RecipeIngredientsData[];
  recipePreparings: RecipePreparingData[];

  constructor(public recipeService: recipeService, public recipeIngredientService: recipeIngredientService, public recipePreparingService: recipePreparingService) { }

  ngOnInit(): void {
    // Calling methods that allow data to be received from firebase

    this.recipeService.getRecipes().subscribe(recipes => {
      // Getting single recipe by selected recipe ID
      this.recipe = recipes.find(recipe => recipe.recipeId === this.selectedRecipeID);
    });
    this.recipeIngredientService.getRecipeIngredients().subscribe(recipeIngredients => {
      // Getting array of recipe's ingredients by selected recipe ID and sorting it ascending
      this.recipeIngredients = recipeIngredients.filter(ingredients => ingredients.recipeId === this.selectedRecipeID);
      this.recipeIngredients.sort();
    });
    this.recipePreparingService.getRecipePreparings().subscribe(recipePreparings => {
      // Getting array of recipe's preparing steps by selected recipe ID and sorting it ascending
      this.recipePreparings = recipePreparings.filter(preparings => preparings.recipeId === this.selectedRecipeID);
      this.recipePreparings.sort((a, b) => a.stepNumber - b.stepNumber);
    });
  }

  // Methods which allows to get recipe parameters
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

  // Method responsible for deleting recipe from database
  deleteRecipe = () => {
    this.intoHomePage.emit(true);
    this.recipeService.deleteRecipe(this.recipe);
    this.recipeIngredientService.deleteRecipeIngredient(this.recipeIngredients);
    this.recipePreparingService.deleteRecipePreparing(this.recipePreparings);
  }
}
