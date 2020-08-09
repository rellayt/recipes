import { Component, OnInit, Output } from '@angular/core';
import { recipeData } from '../recipeData';
import { recipeService } from '../services/recipe.service';
import { imageService } from '../services/image.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Output()
  recipeIndex: EventEmitter<number> = new EventEmitter<number>();

  recipes: recipeData[];
  latestRecipes: recipeData[];

  constructor(public recipeService: recipeService, public images: imageService) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.getLatestRecipes();
    });
  }

  getRecipeDetails(recipeIndex: number) {
    this.recipeIndex.emit(recipeIndex);
  }

  getLatestRecipes() {
    let recipeNextRef = [...this.recipes];

    const firstMaxRecipeID = this.recipes.reduce((a, b) => a.recipeId > b.recipeId ? a : b).recipeId;
    this.removeElementByRecipeId(recipeNextRef, firstMaxRecipeID);

    const secondMaxRecipeID = recipeNextRef.reduce((a, b) => a.recipeId > b.recipeId ? a : b).recipeId;
    this.removeElementByRecipeId(recipeNextRef, secondMaxRecipeID);

    const thirdMaxRecipeID = recipeNextRef.reduce((a, b) => a.recipeId > b.recipeId ? a : b).recipeId;

    const firstRecipe = this.recipes.find(x => x.recipeId === firstMaxRecipeID);
    const secondRecipe = this.recipes.find(x => x.recipeId === secondMaxRecipeID);
    const thirdRecipe = this.recipes.find(x => x.recipeId === thirdMaxRecipeID);

    this.latestRecipes = [];

    if (firstMaxRecipeID >= 2) {
      this.latestRecipes.push(firstRecipe);
      this.latestRecipes.push(secondRecipe);
      this.latestRecipes.push(thirdRecipe);
    }
  }
  removeElementByRecipeId(recipeArray: recipeData[], recipeId: number) {
    for (let i = 0; i < recipeArray.length; i++) {
      if (recipeArray[i].recipeId === recipeId) {
        recipeArray.splice(i, 1);
        break;
      }
    }
  }
  getRecipeImage(index: number): string {
    if (this.latestRecipes) {
      return this.latestRecipes[index].image;
    }
  }
  getRecipeTime(index: number): string {
    if (this.latestRecipes) {
      return this.latestRecipes[index].time;
    }
  }
  getRecipeTitle(index: number): string {
    if (this.latestRecipes) {
      return this.latestRecipes[index].title;
    }
  }
  getRecipeIndex(index: number): number {
    if (this.latestRecipes) {
      return this.latestRecipes[index].recipeId;
    }
  }


}
