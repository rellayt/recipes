import { Component } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './app.recipes.html',
  styleUrls: ['./app.recipes.scss']
})
export class AppRecipes {
  // Conditional variables which allow to go to other pages
  homePage = true;
  detailsPage = false;
  addRecipePage = false;
  intoHomePage() {
    this.homePage = true;
    this.detailsPage = false;
    this.addRecipePage = false;
    this.menuIcon = true;
  }

  intoAddRecipePage() {
    this.addRecipePage = true;
    this.homePage = false;
    this.detailsPage = false;
    this.menuIcon = true;
  }

  intoDetailsPage(recipeIndex: number) {
    this.detailsPage = true;
    this.homePage = false;
    this.addRecipePage = false;
    this.menuIcon = true;
    this.selectedRecipeID = recipeIndex;
  }

}
