import { Component, OnInit, HostListener } from '@angular/core';
import { RecipeData, RecipeIngredientsData, RecipePreparingData } from '../recipeData';
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

  // Variable responsible for getting MAX recipe ID
  recipeMaxIndex = 0;

  // Variable that store data from firebase
  recipes: RecipeData[];

  // Variables used to finally add data to the firebase
  recipeToAdd: RecipeData = { description: '', title: '', time: '', recipeId: 1, image: '' };
  recipeIngredientToAdd: RecipeIngredientsData = { recipeId: 0, quantity: '', ingredient: '' };
  recipePreparingToAdd: RecipePreparingData = { recipeId: 0, step: '', stepNumber: 1 };

  // Input variables
  titleInput = '';
  timeInput: number;
  timeTypeInput = '';
  descriptionInput = '';
  stepInput: string[];
  selectTimeType: selectOption[] = [{ id: 0, value: 'minutes' }, { id: 1, value: 'hours' }];
  stepCount = 0;
  selectedLevel;
  imageUploaded = false;

  public preparing: preparing[] = [{
    stepNumber: 1,
    stepName: '',
  }];
  public ingredients: ingredient[] = [{
    quantity: '',
    name: '',
  }];

  // Variables used to improve website responsiveness
  public innerWidth: any;
  mobileMode = false;

  constructor(public recipeService: recipeService, public recipeIngredientService: recipeIngredientService, public recipePreparingService: recipePreparingService, public images: imageService) { }

  ngOnInit(): void {
    // Checking for page width
    this.innerWidth = window.innerWidth;
    this.checkForWidth();

    // Calling methods to get max recipe id and url of uploaded image
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

  // Method responsible for validate inputs, prepare final variables to be added,
  // adding recipe to database and reset input values
  addRecipe() {
    const findEmptyName = this.ingredients.find(x => x.name === '') ? true : false;
    const findEmptyQuantity = this.ingredients.find(x => x.quantity === '') ? true : false;
    const findEmptyPrepareField = this.preparing.find(x => x.stepName === '') ? true : false;

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

      this.recipePreparingToAdd.recipeId = this.recipeMaxIndex + 1;
      this.recipeIngredientToAdd.recipeId = this.recipeMaxIndex + 1;

      for (const prepare of this.preparing) {
        this.recipePreparingToAdd.stepNumber = prepare.stepNumber;
        this.recipePreparingToAdd.step = prepare.stepName;
        this.recipePreparingService.addRecipePreparing(this.recipePreparingToAdd);
      }
      for (const ingredient of this.ingredients) {
        this.recipeIngredientToAdd.ingredient = ingredient.name;
        this.recipeIngredientToAdd.quantity = ingredient.quantity;
        this.recipeIngredientService.addRecipeIngredient(this.recipeIngredientToAdd);
      }
      this.recipeService.addRecipe(this.recipeToAdd);
      this.resetInputValues();
    }
  }

  // Method responsible for validating and adding single ingredient to temporary array which will be added to database
  addIngredient() {
    const findEmptyName = this.ingredients.find(x => x.name === '') ? true : false;
    const findEmptyQuantity = this.ingredients.find(x => x.quantity === '') ? true : false;

    if (!findEmptyName && !findEmptyQuantity) {
      const emptyIngredient: ingredient = { name: '', quantity: '' };
      this.ingredients.push(emptyIngredient);
    }
  }

  // Method responsible for validating and adding single preape step to temporary array which will be added to database
  addStep(stepNumber: number) {
    const findEmptyPrepareField = this.preparing.find(x => x.stepName === '') ? true : false;

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

  // Method which returns url of uploaded image
  getRecipeUploadedImage = () => {
    return this.recipeToAdd.image ? this.recipeToAdd.image : '';
  }

  // Method responsible for validate title, prepare time, description, selected level and image's url inputs
  checkInputs = (): boolean => {
    if (this.titleInput !== '' && this.timeInput && this.descriptionInput !== '' && this.selectedLevel && this.recipeToAdd.image) {
      return true;
    } else {
      return false;
    }
  }

  // Method responsible for reseting input value
  resetInputValues() {
    this.titleInput = '';
    this.timeInput = undefined;
    this.descriptionInput = '';
    this.recipeToAdd.image = '';
    this.images.changeImageProperties('');
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
  }

  // Checking page width for mobile efficiency
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = Number(window.innerWidth);
    this.checkForWidth();
  }

  checkForWidth = () => {
    if (this.innerWidth >= 535 && this.innerWidth <= 560) {
      this.mobileMode = true;
    } else if (this.innerWidth >= 320 && this.innerWidth <= 420) {
      this.mobileMode = true;
    } else {
      this.mobileMode = false;
    }
  }
}
export class selectOption {
  constructor(public id: number, public value: string) { }
}
