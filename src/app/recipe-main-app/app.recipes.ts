import { Component } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './app.recipes.html',
  styleUrls: ['./app.recipes.scss']
})
export class AppRecipes {

  homePage = true;
  detailsPage = false;
  addPage = false;

  selectedRecipeId: number;
  title = 'Recipes';

  intoHomePage() {
    this.homePage = true;
    this.detailsPage = false;
    this.addPage = false;
  }
  intoAddPage() {
    this.addPage = true;
    this.homePage = false;
    this.detailsPage = false;
  }

  intoDetailsPage(recipeIndex: number) {
    this.detailsPage = true;
    this.homePage = false;
    this.addPage = false;
    this.selectedRecipeId = recipeIndex;
  }

}
