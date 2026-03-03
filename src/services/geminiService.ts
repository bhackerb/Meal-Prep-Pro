import { GoogleGenAI, Type } from "@google/genai";
import { MealPlan, Preferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        totalDailyCalories: { type: Type.NUMBER },
        totalDailyProtein: { type: Type.NUMBER },
        totalDailyCarbs: { type: Type.NUMBER },
        totalDailyFat: { type: Type.NUMBER },
        estimatedWeeklyCost: { type: Type.NUMBER },
        totalUniqueIngredients: { type: Type.NUMBER }
      }
    },
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          prepTime: { type: Type.NUMBER, description: "Prep time in minutes" },
          cookTime: { type: Type.NUMBER, description: "Cook time in minutes" },
          difficulty: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                category: { type: Type.STRING }
              }
            }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          toolsNeeded: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          imagePrompt: { type: Type.STRING, description: "A detailed prompt to generate an image of this finished dish" }
        }
      }
    },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mealName: { type: Type.STRING },
                recipeId: { type: Type.STRING }
              }
            }
          }
        }
      }
    },
    mealPrepGuide: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.NUMBER },
          instruction: { type: Type.STRING },
          timeEstimate: { type: Type.NUMBER, description: "Time in minutes" }
        }
      }
    },
    shoppingList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                totalAmount: { type: Type.NUMBER },
                unit: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  }
};

export async function generateMealPlan(prefs: Preferences): Promise<MealPlan> {
  const macroString = prefs.macroType === 'percent'
    ? `${prefs.proteinTarget}% Protein, ${prefs.carbsTarget}% Carbs, ${prefs.fatTarget}% Fat`
    : `${prefs.proteinTarget}g Protein, ${prefs.carbsTarget}g Carbs, ${prefs.fatTarget}g Fat`;

  const prompt = `
    Generate a comprehensive weekly meal prep plan based on the following preferences:
    - Daily Calories Target: ${prefs.calories} kcal
    - Macros: ${macroString}
    - Meals per day: ${prefs.mealsPerDay}
    - Unique recipes per week: ${prefs.uniqueRecipesPerWeek} (Meal variety)
    - Diet Preferences: ${prefs.dietPreferences || "None"}
    - Weekly Budget: $${prefs.budgetMin} - $${prefs.budgetMax}
    - Max Ingredients Complexity: ${prefs.maxIngredients}
    - Recipe Difficulty: ${prefs.difficulty}
    - Max Prep/Cook Time per recipe: ${prefs.maxPrepTime} minutes
    - Available Tools: ${prefs.tools.length > 0 ? prefs.tools.join(", ") : "Standard kitchen tools"}

    Requirements:
    1. Create exactly ${prefs.uniqueRecipesPerWeek} unique recipes that fit these constraints.
    2. The daily total of calories and macros (sum of meals per day) must closely match the targets.
    3. Provide a 7-day schedule using these recipes.
    4. Provide a step-by-step meal prep guide for Sunday (or prep day) to efficiently prepare these meals in bulk.
    5. Provide a categorized shopping list for all ingredients needed for the entire week.
    6. Ensure the imagePrompt for each recipe is highly descriptive, focusing on the visual presentation of the finished dish.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: mealPlanSchema,
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as MealPlan;
}

export async function generateRecipeImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return "";
  } catch (error) {
    console.error("Failed to generate image", error);
    return "";
  }
}
