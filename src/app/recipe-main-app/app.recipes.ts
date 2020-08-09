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

  // Variable represents the id of the selected recipe to be
  // displayed on detailsPage
  selectedRecipeID: number;

  // Variable allows to interact with mobile menu icon
  menuIcon = true;

  // Methods responsible for moving around the pages
  intoHomePage() {
    this.homePage = true;
    this.detailsPage = false;
    this.addRecipePage = false;
  }

  intoAddRecipePage() {
    this.addRecipePage = true;
    this.homePage = false;
    this.detailsPage = false;
  }

  intoDetailsPage(recipeIndex: number) {
    this.detailsPage = true;
    this.homePage = false;
    this.addRecipePage = false;
    this.selectedRecipeID = recipeIndex;
  }

  // Method responsible for interact with mobile menu icon
  toogleMenu() {
    this.menuIcon = !this.menuIcon;
  }
}
