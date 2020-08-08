export class recipeData {
  constructor(public recipeId: number,
    public title: string, public time: string, public description: string,
    public image?: string, public idSource?: string) { }
}

export class recipeIngredientsData {
  constructor(public recipeId: number, public quantity: string,
    public ingredient: string, public idSource?: string) { }
}
export class recipePreparingData {
  constructor(public recipeId: number, public stepNumber: number,
    public step: string, public idSource?: string) { }
}
