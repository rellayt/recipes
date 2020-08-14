import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  menuIcon = true;

  // Variable represents the id of the selected recipe to be
  // displayed on detailsPage
  selectedRecipeID: number;

  // Method responsible for interact with mobile menu icon
  toogleMenu() {
    this.menuIcon = !this.menuIcon;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
