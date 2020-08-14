import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { RecipePreparingData } from '../recipeData';
import { RecipeDataService } from './recipe.data.service';

@Injectable({
  providedIn: 'root'
})
export class recipePreparingService {
  recipePreparingCollection: AngularFirestoreCollection<RecipePreparingData>;
  recipePreparings: Observable<RecipePreparingData[]>;
  recipePreparingDoc: AngularFirestoreDocument<RecipePreparingData>;

  constructor(public afs: AngularFirestore, public recipeDataService: RecipeDataService) {
    this.recipePreparingCollection = this.afs.collection('recipePreparing', ref => ref.orderBy('recipeId', 'asc'));

    this.recipePreparings = this.recipePreparingCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as RecipePreparingData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
    this.recipePreparings.subscribe(preparing => {
      this.recipeDataService.changePreparingData(preparing);
    });
  }
  getRecipePreparings() {
    return this.recipePreparings;
  }
  addRecipePreparing(recipePreparing: RecipePreparingData) {
    this.recipePreparingCollection.add(JSON.parse(JSON.stringify(recipePreparing)));
  }
  deleteRecipePreparing(recipePreparing: RecipePreparingData[]) {
    for (const prepare of recipePreparing) {
      const res = this.afs.collection('recipePreparing').doc(`${prepare.idSource}`);
      res.delete();
    }
  }
}
