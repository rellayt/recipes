import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { recipePreparingData } from '../recipeData';

@Injectable({
  providedIn: 'root'
})
export class recipePreparingService {
  recipePreparingCollection: AngularFirestoreCollection<recipePreparingData>;
  recipePreparings: Observable<recipePreparingData[]>;
  recipePreparingDoc: AngularFirestoreDocument<recipePreparingData>;

  constructor(public afs: AngularFirestore) {
    this.recipePreparingCollection = this.afs.collection('recipePreparing', ref => ref.orderBy('recipeId', 'asc'));

    this.recipePreparings = this.recipePreparingCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as recipePreparingData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getRecipePreparings() {
    return this.recipePreparings;
  }
  addRecipePreparing(recipePreparing: recipePreparingData) {
    this.recipePreparingCollection.add(JSON.parse(JSON.stringify(recipePreparing)));
  }
  deleteRecipePreparing(recipePreparing: recipePreparingData[]) {
    for (const prepare of recipePreparing) {
      const res = this.afs.collection('recipePreparing').doc(`${prepare.idSource}`);
      res.delete();
    }
  }
}
