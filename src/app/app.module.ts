import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppRecipes } from './recipe-main-app/app.recipes';
import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { recipeService } from './services/recipe.service';
import { recipeIngredientService } from './services/recipe.ingredient.service';
import { recipePreparingService } from './services/recipe.preparing.service';
import { imageService } from './services/image.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeAddingComponent } from './recipe-adding/recipe-adding.component';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppRecipes,
    HomeComponent,
    RecipeDetailsComponent,
    RecipeAddingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'recipes'),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [recipeService, recipeIngredientService, recipePreparingService, imageService],
  bootstrap: [AppRecipes]
})
export class AppModule { }
