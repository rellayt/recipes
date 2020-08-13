import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { RecipeIngredientsData } from '../recipeData';

@Injectable({
  providedIn: 'root'
})
export class recipeIngredientService {
  recipeIngredientsCollection: AngularFirestoreCollection<RecipeIngredientsData>;
  recipeIngredients: Observable<RecipeIngredientsData[]>;
  recipeIngredientsDoc: AngularFirestoreDocument<RecipeIngredientsData>;

  constructor(public afs: AngularFirestore) {
    this.recipeIngredientsCollection = this.afs.collection('recipeIngredients', ref => ref.orderBy('recipeId', 'asc'));

    this.recipeIngredients = this.recipeIngredientsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as RecipeIngredientsData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getRecipeIngredients() {
    return this.recipeIngredients;
  }
  addRecipeIngredient(recipeIngredients: RecipeIngredientsData) {
    this.recipeIngredientsCollection.add(JSON.parse(JSON.stringify(recipeIngredients)));
  }
  deleteRecipeIngredient(recipeIngredient: RecipeIngredientsData[]) {
    for (const ingredient of recipeIngredient) {
      const res = this.afs.collection('recipeIngredients').doc(`${ingredient.idSource}`);
      res.delete();
    }
  }
}
