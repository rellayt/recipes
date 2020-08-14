import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RecipeIngredientsData } from '../recipeData';
import { RecipePreparingData } from '../recipeData';
import { RecipeData } from '../recipeData';

@Injectable()

export class RecipeDataService {
  private recipeDataInit: RecipeData[] = [];
  private ingredientDataInit: RecipeIngredientsData[] = [];
  private preparingDataInit: RecipePreparingData[] = [];

  private recipeDataSource = new BehaviorSubject<RecipeData[]>(this.recipeDataInit);
  private ingredientDataSource = new BehaviorSubject<RecipeIngredientsData[]>(this.ingredientDataInit);
  private preparingDataSource = new BehaviorSubject<RecipePreparingData[]>(this.preparingDataInit);

  recipeChangingData = this.recipeDataSource.asObservable();
  ingredientChangingData = this.ingredientDataSource.asObservable();
  preparingChangingData = this.preparingDataSource.asObservable();

  changeRecipeData(recipe: RecipeData[]) {
    this.recipeDataSource.next(recipe);
  }
  changeIngredientData(ingredient: RecipeIngredientsData[]) {
    this.ingredientDataSource.next(ingredient);
  }
  changePreparingData(preparing: RecipePreparingData[]) {
    this.preparingDataSource.next(preparing);
  }
}
