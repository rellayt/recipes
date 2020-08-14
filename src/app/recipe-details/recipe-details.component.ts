import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { recipeIngredientService } from '../services/recipe.ingredient.service';
import { recipePreparingService } from '../services/recipe.preparing.service';
import { recipeService } from '../services/recipe.service';
import { RecipeData, RecipeIngredientsData, RecipePreparingData } from '../recipeData';
import { ActivatedRoute } from '@angular/router';
import { RecipeDataService } from '../services/recipe.data.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {

  // Variables that store data from firebase
  recipe: RecipeData;
  recipeIngredients: RecipeIngredientsData[];
  recipePreparings: RecipePreparingData[];

  // tslint:disable-next-line: max-line-length
  constructor(public recipeDataService: RecipeDataService, private route: ActivatedRoute, public recipeService: recipeService, public recipeIngredientService: recipeIngredientService, public recipePreparingService: recipePreparingService) { }

  ngOnInit(): void {
    const recipeId = Number(this.route.snapshot.paramMap.get('id'));

    this.recipeDataService.recipeChangingData.subscribe(recipes => {
      this.recipe = recipes.find(recipe => recipe.recipeId === recipeId);
    });

    this.recipeDataService.ingredientChangingData.subscribe(recipeIngredients => {
      this.recipeIngredients = recipeIngredients.filter(ingredients => ingredients.recipeId === recipeId);
      this.recipeIngredients.sort();
    });

    this.recipeDataService.preparingChangingData.subscribe(recipePreparings => {
      this.recipePreparings = recipePreparings.filter(preparings => preparings.recipeId === recipeId);
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
    this.recipeService.deleteRecipe(this.recipe);
    this.recipeIngredientService.deleteRecipeIngredient(this.recipeIngredients);
    this.recipePreparingService.deleteRecipePreparing(this.recipePreparings);
  }
}
