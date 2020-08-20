import { Component, OnInit, HostListener } from '@angular/core';
import { RecipeData, RecipeIngredientsData, RecipePreparingData } from '../recipeData';
import { recipeIngredientService } from '../services/recipe.ingredient.service';
import { recipePreparingService } from '../services/recipe.preparing.service';
import { recipeService } from '../services/recipe.service';
import { imageService } from '../services/image.service';
import { RecipeDataService } from '../services/recipe.data.service';
import { Validators, FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface Ingredient {
  quantity: string;
  name: string;
}
interface Preparing {
  stepNumber: number;
  stepName: string;
}
export interface TimeOptions {
  value: string;
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
  timeOptions: TimeOptions[] = [
    { value: '15 minutes' },
    { value: '30 minutes' },
    { value: '45 minutes' },
    { value: '1 hour' },
    { value: '2 hours' }
  ];
  stepCount = 0;
  selectedLevel;
  imageUploaded = false;
  firstQuantity = '';
  firstIngredientName = '';

  preparing: Preparing[] = [{
    stepNumber: 1,
    stepName: '',
  }];
  ingredients: Ingredient[] = [];

  //Form controls
  formGroup: FormGroup;

  BasicInformationForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  FirstIngredientsForm = new FormGroup({
    firstQuantityControl: new FormControl('', [Validators.required]),
    firstNameControl: new FormControl('', [Validators.required])
  });


  // tslint:disable-next-line: max-line-length
  constructor(public router: Router, private snackBar: MatSnackBar, private fb: FormBuilder, public recipeDataService: RecipeDataService, public recipeService: recipeService, public recipeIngredientService: recipeIngredientService, public recipePreparingService: recipePreparingService, public images: imageService) {
    this.formGroup = this.fb.group
      ({
        IngredientsArr: this.fb.array([]),
        PreparingArr: this.fb.array([]),
      });
    const Preparings = this.formGroup.get('PreparingArr') as FormArray;
    Preparings.push(this.fb.group({
      StepControl: new FormControl('', [Validators.required])
    }));
  }

  ngOnInit(): void {
    // Calling methods to get max recipe id and url of uploaded image
    try {
      this.recipeDataService.recipeChangingData.subscribe(recipes => {
        this.recipes = recipes;
        if (this.recipes.length > 0) {
          this.recipeMaxIndex = this.recipes.reduce((a, b) => a.recipeId > b.recipeId ? a : b).recipeId;
        }
      });
    } catch (e) {
      console.log(e);
    }
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
      let recipeTime = String(this.selectedLevel);
      if (recipeTime.substring(3) === 'minutes') {
        recipeTime = recipeTime.substring(0, 2) + ' min';
      } else if (recipeTime.substring(2) === 'hours') {
        recipeTime = recipeTime.substring(0, 1) + ' hours';
      } else {
        recipeTime = recipeTime.substring(0, 1) + ' hour';
      }

      this.recipeToAdd.recipeId = this.recipeMaxIndex + 1;
      this.recipeToAdd.title = this.titleInput;
      this.recipeToAdd.time = recipeTime;
      this.recipeToAdd.description = this.descriptionInput;

      this.recipePreparingToAdd.recipeId = this.recipeMaxIndex + 1;
      this.recipeIngredientToAdd.recipeId = this.recipeMaxIndex + 1;
      this.ingredients.unshift({ quantity: this.firstQuantity, name: this.firstIngredientName });

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
      this.router.navigate(['/home']);
      this.openSnackBar();
      this.resetInputValues();
    }
  }
  openSnackBar() {
    this.snackBar.open('Recipe added succesfully', 'Cancel', {
      duration: 1200,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['add-snackbar']
    });
  }
  // Method responsible for validating and adding single ingredient to temporary array which will be added to database
  addIngredient() {
    const findEmptyName = this.ingredients.find(x => x.name === '') ? true : false;
    const findEmptyQuantity = this.ingredients.find(x => x.quantity === '') ? true : false;
    if (!findEmptyName && !findEmptyQuantity && this.firstIngredientName !== '' && this.firstQuantity !== '') {
      const Ingredients = this.formGroup.get('IngredientsArr') as FormArray;
      Ingredients.push(this.fb.group({
        QuantityControl: new FormControl('', [Validators.required]),
        NameControl: new FormControl('', [Validators.required])
      }));
      const emptyIngredient: Ingredient = { name: '', quantity: '' };
      this.ingredients.push(emptyIngredient);
    }
  }
  getIngredientControls() {
    return (this.formGroup.get('IngredientsArr') as FormArray).controls;
  }
  getPrepareControls() {
    return (this.formGroup.get('PreparingArr') as FormArray).controls;
  }
  // Method responsible for validating and adding single preape step to temporary array which will be added to database
  addStep(stepNumber: number) {
    const findEmptyPrepareField = this.preparing.find(x => x.stepName === '') ? true : false;

    if (!findEmptyPrepareField) {

      const Preparings = this.formGroup.get('PreparingArr') as FormArray;
      Preparings.push(this.fb.group({
        StepControl: new FormControl('', [Validators.required])
      }));

      const emptyPrepareField: Preparing = { stepNumber: stepNumber + 1, stepName: '' }
      this.preparing.push(emptyPrepareField);
    }
  }

  uploadImage(event: any) {
    const file: File = event.target.files[0];
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      this.images.putImage(file, this.recipeMaxIndex + 1);
    }
  }

  // Method responsible for validate title, prepare time, description, selected level and image's url inputs
  checkInputs = (): boolean => {
    if (this.titleInput !== '' && this.descriptionInput !== '' && this.selectedLevel && this.recipeToAdd.image) {
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
    this.ingredients = [];
    this.firstQuantity = '';
    this.firstIngredientName = '';
    this.imageUploaded = false;
    this.formGroup = this.fb.group
      ({
        IngredientsArr: this.fb.array([]),
        PreparingArr: this.fb.array([])
      });
    const Preparings = this.formGroup.get('PreparingArr') as FormArray;
    Preparings.push(this.fb.group({
      StepControl: new FormControl('', [Validators.required])
    }));
  }

  limitLines(event: InputEvent, maxLines: number) {
    const text = (event.target as HTMLTextAreaElement).value;
    if (text.length > 0) {
      const lineCount = 1 + text.replace(/[^\n]/g, '').length;
      if (lineCount > maxLines) {
        const textArray = text.split('\n');
        const newText = textArray.reduce((result, line, lineNum) => {
          if (lineNum < maxLines) {
            return result.concat('\n').concat(line);
          }
          return result.concat(line);
        });
        (event.target as HTMLTextAreaElement).value = newText;
      }
    }
  }
}
