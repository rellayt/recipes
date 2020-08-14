import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppRecipes } from './recipe-main-app/app.recipes';
import { environment } from '../environments/environment.prod';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { recipeService } from './services/recipe.service';
import { recipeIngredientService } from './services/recipe.ingredient.service';
import { recipePreparingService } from './services/recipe.preparing.service';
import { imageService } from './services/image.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NavigationComponent } from './navigation/navigation.component';
import { RecipeDataService } from './services/recipe.data.service';

@NgModule({
  declarations: [
    AppRecipes,
    routingComponents,
    NavigationComponent,
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
  providers: [recipeService, recipeIngredientService, recipePreparingService, imageService, RecipeDataService],
  bootstrap: [AppRecipes, NavigationComponent]
})
export class AppModule { }
