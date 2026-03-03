import { useState, useEffect } from 'react';
import { MealPlan, Preferences } from './types';
import { generateMealPlan, generateRecipeImage } from './services/geminiService';
import PreferencesForm from './components/PreferencesForm';
import Dashboard from './components/Dashboard';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleGenerate = async (prefs: Preferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPlan = await generateMealPlan(prefs);
      setPlan(newPlan);
      
      // Generate images in the background sequentially to avoid rate limits
      const generateImages = async () => {
        for (let index = 0; index < newPlan.recipes.length; index++) {
          const recipe = newPlan.recipes[index];
          if (recipe.imagePrompt) {
            const imageUrl = await generateRecipeImage(recipe.imagePrompt);
            if (imageUrl) {
              setPlan(currentPlan => {
                if (!currentPlan) return currentPlan;
                const updatedRecipes = [...currentPlan.recipes];
                updatedRecipes[index] = { ...updatedRecipes[index], imageUrl };
                return { ...currentPlan, recipes: updatedRecipes };
              });
            }
            // Add a small delay between requests to prevent API rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      };
      
      generateImages();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/30">
          <p className="font-semibold">Error generating plan:</p>
          <p>{error}</p>
        </div>
      )}

      {!plan ? (
        <PreferencesForm onSubmit={handleGenerate} isLoading={isLoading} />
      ) : (
        <Dashboard plan={plan} onReset={() => setPlan(null)} />
      )}
    </div>
  );
}
