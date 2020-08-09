import { Injectable, Component } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { recipeData } from '../recipeData';

@Injectable({
  providedIn: 'root'
})
export class recipeService {
  recipesCollection: AngularFirestoreCollection<recipeData>;
  recipes: Observable<recipeData[]>;
  recipesDoc: AngularFirestoreDocument<recipeData>;

  constructor(public afs: AngularFirestore) {
    this.recipesCollection = this.afs.collection('recipes', ref => ref.orderBy('recipeId', 'asc'));

    this.recipes = this.recipesCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as recipeData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getRecipes() {
    return this.recipes;
  }
  addRecipe(recipe: recipeData) {
    this.recipesCollection.add(JSON.parse(JSON.stringify(recipe)));
  }
  deleteRecipe(recipe: recipeData) {
    const res = this.afs.collection('recipes').doc(`${recipe.idSource}`);
    res.delete();
  }
}
