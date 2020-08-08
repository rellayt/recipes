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
    const maxRecipeID = this.recipes.reduce((a, b) => a.recipeId > b.recipeId ? a : b).recipeId;
    this.latestRecipes = [];
    if (maxRecipeID >= 2) {
      this.latestRecipes.push(this.recipes[maxRecipeID]);
      this.latestRecipes.push(this.recipes[maxRecipeID - 1]);
      this.latestRecipes.push(this.recipes[maxRecipeID - 2]);
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
