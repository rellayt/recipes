import { Injectable, Component } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { RecipeData } from '../recipeData';

@Injectable({
  providedIn: 'root'
})
export class recipeService {
  recipesCollection: AngularFirestoreCollection<RecipeData>;
  recipes: Observable<RecipeData[]>;
  recipesDoc: AngularFirestoreDocument<RecipeData>;

  constructor(public afs: AngularFirestore) {
    this.recipesCollection = this.afs.collection('recipes', ref => ref.orderBy('recipeId', 'asc'));

    this.recipes = this.recipesCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as RecipeData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getRecipes() {
    return this.recipes;
  }
  addRecipe(recipe: RecipeData) {
    this.recipesCollection.add(JSON.parse(JSON.stringify(recipe)));
  }
  deleteRecipe(recipe: RecipeData) {
    const res = this.afs.collection('recipes').doc(`${recipe.idSource}`);
    res.delete();
  }
}
