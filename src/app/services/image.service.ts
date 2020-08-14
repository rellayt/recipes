import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class imageService {
  Test: string = '';

  private imageSource = new BehaviorSubject<string>(this.Test);
  currentImage = this.imageSource.asObservable();

  imageUrlRecipe = '';

  constructor(public afs: AngularFireStorage) {
    firebase.initializeApp(environment.firebase);
    this.changeImageProperties('');
  }

  async putImage(file: File, recipeId: number) {
    const snap = await this.afs.upload(`/images/${recipeId}`, file);
    this.getUrl(snap);
  }

  private async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    this.imageUrlRecipe = url;
    this.changeImageProperties(this.imageUrlRecipe);
  }

  changeImageProperties(imageURL: string) {
    this.imageSource.next(imageURL);
  }
}

