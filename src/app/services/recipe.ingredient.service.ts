import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { recipeIngredientsData } from '../recipeData';

@Injectable({
  providedIn: 'root'
})
export class recipeIngredientService {
  recipeIngredientsCollection: AngularFirestoreCollection<recipeIngredientsData>;
  recipeIngredients: Observable<recipeIngredientsData[]>;
  recipeIngredientsDoc: AngularFirestoreDocument<recipeIngredientsData>;

  constructor(public afs: AngularFirestore) {
    this.recipeIngredientsCollection = this.afs.collection('recipeIngredients', ref => ref.orderBy('recipeId', 'asc'));

    this.recipeIngredients = this.recipeIngredientsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as recipeIngredientsData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getRecipeIngredients() {
    return this.recipeIngredients;
  }
  addRecipeIngredient(recipeIngredients: recipeIngredientsData) {
    this.recipeIngredientsCollection.add(JSON.parse(JSON.stringify(recipeIngredients)));
  }
}
