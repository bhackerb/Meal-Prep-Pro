import React, { useState } from 'react';
import { Preferences } from '../types';
import { motion } from 'motion/react';
import { ChefHat, Settings2, DollarSign, Clock, Utensils, Flame } from 'lucide-react';

interface Props {
  onSubmit: (prefs: Preferences) => void;
  isLoading: boolean;
}

const DEFAULT_PREFS: Preferences = {
  calories: 2000,
  macroType: 'percent',
  proteinTarget: 30,
  carbsTarget: 40,
  fatTarget: 30,
  mealsPerDay: 3,
  uniqueRecipesPerWeek: 5,
  dietPreferences: 'None',
  budgetMin: 50,
  budgetMax: 100,
  maxIngredients: 'Medium',
  difficulty: 'Medium',
  maxPrepTime: 60,
  tools: ['Oven', 'Stove', 'Microwave'],
};

const TOOLS_LIST = ['Oven', 'Stove', 'Microwave', 'Blender', 'Slow Cooker', 'Air Fryer', 'Instant Pot', 'Food Processor'];

export default function PreferencesForm({ onSubmit, isLoading }: Props) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPrefs(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleToolToggle = (tool: string) => {
    setPrefs(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200"
    >
      <div className="bg-slate-900 dark:bg-slate-950 text-white p-8">
        <div className="flex items-center gap-4 mb-2">
          <ChefHat className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold tracking-tight">Meal Prep Pro</h1>
        </div>
        <p className="text-slate-400">Configure your perfect weekly meal plan</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Macros & Calories */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Daily Targets</h2>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setPrefs(p => ({ ...p, macroType: 'percent' }))}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${prefs.macroType === 'percent' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Percent (%)
              </button>
              <button
                type="button"
                onClick={() => setPrefs(p => ({ ...p, macroType: 'grams' }))}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${prefs.macroType === 'grams' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Grams (g)
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Calories (kcal)</label>
              <input type="number" name="calories" value={prefs.calories} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Protein ({prefs.macroType === 'percent' ? '%' : 'g'})</label>
              <input type="number" name="proteinTarget" value={prefs.proteinTarget} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Carbs ({prefs.macroType === 'percent' ? '%' : 'g'})</label>
              <input type="number" name="carbsTarget" value={prefs.carbsTarget} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fat ({prefs.macroType === 'percent' ? '%' : 'g'})</label>
              <input type="number" name="fatTarget" value={prefs.fatTarget} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
          </div>
        </section>

        {/* Meal Structure */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b dark:border-slate-800 pb-2">
            <Utensils className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Meal Structure</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meals Per Day</label>
              <input type="number" name="mealsPerDay" value={prefs.mealsPerDay} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unique Recipes / Week</label>
              <input type="number" name="uniqueRecipesPerWeek" value={prefs.uniqueRecipesPerWeek} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dietary Preferences</label>
              <select name="dietPreferences" value={prefs.dietPreferences} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border">
                <option value="None">None</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
                <option value="Paleo">Paleo</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Dairy-Free">Dairy-Free</option>
              </select>
            </div>
          </div>
        </section>

        {/* Logistics */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b dark:border-slate-800 pb-2">
            <Settings2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Logistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weekly Budget Range ($)</label>
              <div className="flex items-center gap-2">
                <input type="number" name="budgetMin" value={prefs.budgetMin} onChange={handleChange} placeholder="Min" className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
                <span className="text-slate-400 dark:text-slate-500 font-medium">to</span>
                <input type="number" name="budgetMax" value={prefs.budgetMax} onChange={handleChange} placeholder="Max" className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ingredient Count</label>
              <select name="maxIngredients" value={prefs.maxIngredients} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border">
                <option value="Minimal">Minimal (Easy Shopping)</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Complex)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
              <select name="difficulty" value={prefs.difficulty} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Prep Time (min)</label>
              <input type="number" name="maxPrepTime" value={prefs.maxPrepTime} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
          </div>
        </section>

        {/* Tools */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b dark:border-slate-800 pb-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Available Tools</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {TOOLS_LIST.map(tool => (
              <label key={tool} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <input 
                  type="checkbox" 
                  checked={prefs.tools.includes(tool)}
                  onChange={() => handleToolToggle(tool)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 dark:bg-slate-900 dark:border-slate-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Plan...
              </>
            ) : (
              'Generate Meal Plan'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
