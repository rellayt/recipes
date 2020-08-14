import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecipeAddingComponent } from './recipe-adding/recipe-adding.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'details/:id', component: RecipeDetailsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-recipe', component: RecipeAddingComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [RecipeDetailsComponent, HomeComponent, PageNotFoundComponent, RecipeAddingComponent];
