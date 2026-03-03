export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string[];
  toolsNeeded: string[];
  imagePrompt: string;
  imageUrl?: string; // We'll add this after generating the image
}

export interface Meal {
  mealName: string;
  recipeId: string;
}

export interface DaySchedule {
  day: string;
  meals: Meal[];
}

export interface PrepStep {
  stepNumber: number;
  instruction: string;
  timeEstimate: number;
}

export interface ShoppingCategory {
  category: string;
  items: {
    name: string;
    totalAmount: number;
    unit: string;
  }[];
}

export interface MealPlan {
  summary: {
    totalDailyCalories: number;
    totalDailyProtein: number;
    totalDailyCarbs: number;
    totalDailyFat: number;
    estimatedWeeklyCost: number;
    totalUniqueIngredients: number;
  };
  recipes: Recipe[];
  schedule: DaySchedule[];
  mealPrepGuide: PrepStep[];
  shoppingList: ShoppingCategory[];
}

export interface Preferences {
  calories: number;
  macroType: 'percent' | 'grams';
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  mealsPerDay: number;
  uniqueRecipesPerWeek: number;
  dietPreferences: string;
  budgetMin: number;
  budgetMax: number;
  maxIngredients: string;
  difficulty: string;
  maxPrepTime: number;
  tools: string[];
}
