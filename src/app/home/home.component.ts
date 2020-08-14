import { Component, OnInit, Output } from '@angular/core';
import { RecipeData } from '../recipeData';
import { recipeService } from '../services/recipe.service';
import { imageService } from '../services/image.service';
import { EventEmitter } from '@angular/core';
import { RecipeDataService } from '../services/recipe.data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Variable used to emit the selected recipe ID to the main recipe component
  @Output()
  recipeIndex: EventEmitter<number> = new EventEmitter<number>();

  recipes: RecipeData[];
  latestRecipes: RecipeData[];

  // tslint:disable-next-line: max-line-length
  constructor(public router: Router, public recipeDataService: RecipeDataService, public RecipeService: recipeService, public images: imageService) { }

  ngOnInit(): void {
    try {
      this.recipeDataService.recipeChangingData.subscribe(recipes => {
        this.recipes = recipes;
        if (this.recipes.length > 0) {
          this.getLatestRecipes();
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  onSelect(id: number) {
    this.router.navigate(['/details', id]);
  }
  // Emitting the selected recipe ID
  getRecipeDetails(recipeIndex: number) {
    this.recipeIndex.emit(recipeIndex);
  }

  // Method clones instance of the main recipe array into a new memory location and detects
  // the three largest recipe ID by sequentially removing them from the temporary array so that
  // they can be retrieved into new variables
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

  removeElementByRecipeId(recipeArray: RecipeData[], recipeId: number) {
    for (let i = 0; i < recipeArray.length; i++) {
      if (recipeArray[i].recipeId === recipeId) {
        recipeArray.splice(i, 1);
        break;
      }
    }
  }
}
