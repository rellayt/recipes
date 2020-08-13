import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {


  // Variable represents the id of the selected recipe to be
  // displayed on detailsPage
  selectedRecipeID: number;

  // Variable allows to interact with mobile menu icon
  menuIcon = true;

  // Methods responsible for moving around the pages


  // Method responsible for interact with mobile menu icon
  toogleMenu() {
    this.menuIcon = !this.menuIcon;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
