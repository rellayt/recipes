import { Component, OnInit } from '@angular/core';
import { recipeData, recipeIngredientsData, recipePreparingData } from '../recipeData';
import { recipeIngredientService } from '../services/recipe.ingredient.service';
import { recipePreparingService } from '../services/recipe.preparing.service';
import { recipeService } from '../services/recipe.service';
import { imageService } from '../services/image.service';

export interface ingredient {
  quantity: string,
  name: string;
}
export interface preparing {
  stepNumber: number,
  stepName: string;
}
@Component({
  selector: 'app-recipe-adding',
  templateUrl: './recipe-adding.component.html',
  styleUrls: ['./recipe-adding.component.scss']
})
export class RecipeAddingComponent implements OnInit {

  recipeMaxIndex = 0;

  recipes: recipeData[];
  recipeIngredientToAdd: recipeIngredientsData = { recipeId: 0, quantity: '', ingredient: '' };
  recipePreparingToAdd: recipePreparingData = { recipeId: 0, step: '', stepNumber: 1 };

  recipeToAdd: recipeData = { description: '', title: '', time: '', recipeId: 1, image: '' };

  titleInput = '';
  timeInput: number;
  timeTypeInput = '';
  descriptionInput = '';
  // quantityInput: string[];
  // ingredientInput: string[];
  stepCount = 0;
  stepInput: string[];

  selectedLevel;
  selectTimeType: selectOption[] = [{ id: 0, value: 'minutes' }, { id: 1, value: 'hours' }];

  imageUploaded = false;
  startReceivingImage = false;
  imageReceived = false;

  public preparing: preparing[] = [{
    stepNumber: 1,
    stepName: '',
  }];
  public ingredients: ingredient[] = [{
    quantity: '',
    name: '',
  }];


  // tslint:disable-next-line: max-line-length
  constructor(public recipeService: recipeService, public recipeIngredientService: recipeIngredientService, public recipePreparingService: recipePreparingService, public images: imageService) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      if (this.recipes) {
        this.recipeMaxIndex = this.recipes.reduce((a, b) => a.recipeId > b.recipeId ? a : b).recipeId;
      }
    });

    this.images.currentImage.subscribe(currentImage => {
      if (currentImage !== '') {
        this.recipeToAdd.image = currentImage;
        this.imageUploaded = true;
      }
    });
  }

  addRecipe() {
    const findEmptyName = this.ingredients.find(x => x.name === '') ? true : false;
    const findEmptyQuantity = this.ingredients.find(x => x.quantity === '') ? true : false;
    const findEmptyPrepareField = this.preparing.find(x => x.stepName === '') ? true : false;
    console.log('%c%s', 'color: #731d6d', this.checkInputs());

    if (!findEmptyName && !findEmptyQuantity && !findEmptyPrepareField && this.checkInputs()) {
      let recipeTime;
      if (this.selectedLevel.value === 'minutes') {
        recipeTime = this.timeInput + ' min';
      }
      else if (this.timeInput !== 1) {
        recipeTime = this.timeInput + ' hours';
      } else {
        recipeTime = this.timeInput + ' hour';
      }
      this.recipeToAdd.recipeId = this.recipeMaxIndex + 1;
      this.recipeToAdd.title = this.titleInput;
      this.recipeToAdd.time = recipeTime;
      this.recipeToAdd.description = this.descriptionInput;
      for (let i = 0; i < this.preparing.length; i++) {
        this.recipePreparingToAdd.recipeId = this.recipeMaxIndex + 1;
        this.recipePreparingToAdd.stepNumber = this.preparing[i].stepNumber;
        this.recipePreparingToAdd.step = this.preparing[i].stepName;
        this.recipePreparingService.addRecipePreparing(this.recipePreparingToAdd);
        // console.log('step nr:', this.preparing[i].stepNumber, 'step name: ', this.preparing[i].stepName);
      }
      for (let i = 0; i < this.ingredients.length; i++) {
        this.recipeIngredientToAdd.recipeId = this.recipeMaxIndex + 1;
        this.recipeIngredientToAdd.ingredient = this.ingredients[i].name;
        this.recipeIngredientToAdd.quantity = this.ingredients[i].quantity;
        this.recipeIngredientService.addRecipeIngredient(this.recipeIngredientToAdd);
        // console.log('quantity', this.ingredients[i].quantity, 'ing name: ', this.ingredients[i].name)
      }
      this.recipeService.addRecipe(this.recipeToAdd);
      this.titleInput = '';
      this.timeInput = undefined;
      this.descriptionInput = '';
      this.recipeToAdd.image = '';
      this.recipeMaxIndex = undefined;
      this.selectedLevel = undefined;
      this.preparing = [{
        stepNumber: 1,
        stepName: '',
      }];
      this.ingredients = [{
        quantity: '',
        name: '',
      }];
      this.imageUploaded = false;

      // console.log('title: ', this.titleInput);
      // console.log('time: ', this.timeInput);
      // console.log('time type: ', this.selectedLevel.value);
      // console.log('desc: ', this.descriptionInput);
      // console.log('img: ', this.recipeToAdd.image);

    }
  }

  addIngredient() {
    const findEmptyName = this.ingredients.find(x => x.name === '') ? true : false;
    const findEmptyQuantity = this.ingredients.find(x => x.quantity === '') ? true : false;

    if (!findEmptyName && !findEmptyQuantity) {
      const emptyIngredient: ingredient = { name: '', quantity: '' };
      this.ingredients.push(emptyIngredient);
    }
  }
  addStep(stepNumber: number) {
    const findEmptyPrepareField = this.preparing.find(x => x.stepName === '') ? true : false;
    console.log('%c%s', 'color: #006dcc', findEmptyPrepareField);

    if (!findEmptyPrepareField) {
      const emptyPrepareField: preparing = { stepNumber: stepNumber + 1, stepName: '' }
      this.preparing.push(emptyPrepareField);
    }
  }

  uploadImage(event: any) {
    const file: File = event.target.files[0];
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      this.images.putImage(file, this.recipeMaxIndex + 1);
    }
  }
  getRecipeUploadedImage = () => {
    return this.recipeToAdd.image ? this.recipeToAdd.image : '';
  }
  checkInputs = (): boolean => {
    if (this.titleInput !== '' && this.timeInput && this.descriptionInput !== '' && this.selectedLevel && this.recipeToAdd.image) {
      return true;
    } else {
      return false;
    }
  }
}
export class selectOption {
  constructor(public id: number, public value: string) { }
}
