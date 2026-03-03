import React, { useState } from 'react';
import { MealPlan, Recipe } from '../types';
import { motion } from 'motion/react';
import { Download, List, ChefHat, Calendar, ShoppingCart, Clock, Flame, Utensils, DollarSign } from 'lucide-react';

interface Props {
  plan: MealPlan;
  onReset: () => void;
}

export default function Dashboard({ plan, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'prep' | 'shopping'>('overview');

  const handleExportMarkdown = () => {
    let md = `# Weekly Meal Plan\n\n`;
    
    md += `## Summary\n`;
    md += `- **Daily Calories:** ${plan.summary.totalDailyCalories} kcal\n`;
    md += `- **Macros:** ${plan.summary.totalDailyProtein}g Protein | ${plan.summary.totalDailyCarbs}g Carbs | ${plan.summary.totalDailyFat}g Fat\n`;
    md += `- **Estimated Cost:** $${plan.summary.estimatedWeeklyCost}\n`;
    md += `- **Unique Ingredients:** ${plan.summary.totalUniqueIngredients}\n\n`;

    md += `## Recipes\n\n`;
    plan.recipes.forEach(r => {
      md += `### ${r.name}\n`;
      md += `*${r.description}*\n\n`;
      md += `- **Prep Time:** ${r.prepTime} min | **Cook Time:** ${r.cookTime} min | **Difficulty:** ${r.difficulty}\n`;
      md += `- **Macros:** ${r.calories} kcal | ${r.protein}g P | ${r.carbs}g C | ${r.fat}g F\n\n`;
      md += `**Ingredients:**\n`;
      r.ingredients.forEach(i => md += `- ${i.amount} ${i.unit} ${i.name}\n`);
      md += `\n**Instructions:**\n`;
      r.instructions.forEach((inst, idx) => md += `${idx + 1}. ${inst}\n`);
      md += `\n---\n\n`;
    });

    md += `## Meal Prep Guide\n\n`;
    plan.mealPrepGuide.forEach(step => {
      md += `${step.stepNumber}. **(${step.timeEstimate} min)** ${step.instruction}\n`;
    });
    md += `\n\n`;

    md += `## Shopping List\n\n`;
    plan.shoppingList.forEach(cat => {
      md += `### ${cat.category}\n`;
      cat.items.forEach(item => {
        md += `- [ ] ${item.totalAmount} ${item.unit} ${item.name}\n`;
      });
      md += `\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal-plan.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportShoppingList = () => {
    let txt = `Shopping List\n=============\n\n`;
    plan.shoppingList.forEach(cat => {
      txt += `${cat.category.toUpperCase()}\n`;
      cat.items.forEach(item => {
        txt += `- [ ] ${item.totalAmount} ${item.unit} ${item.name}\n`;
      });
      txt += `\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Your Meal Plan</h1>
          <p className="text-slate-500 dark:text-slate-400">Ready to prep for the week</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportShoppingList} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium">
            <ShoppingCart className="w-4 h-4" />
            Export List
          </button>
          <button onClick={handleExportMarkdown} className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-sm font-medium">
            <Download className="w-4 h-4" />
            Export Full Plan
          </button>
          <button onClick={onReset} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium transition-colors">
            Start Over
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<List className="w-4 h-4" />} label="Overview" />
        <TabButton active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} icon={<ChefHat className="w-4 h-4" />} label="Recipes" />
        <TabButton active={activeTab === 'prep'} onClick={() => setActiveTab('prep')} icon={<Clock className="w-4 h-4" />} label="Prep Guide" />
        <TabButton active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} icon={<ShoppingCart className="w-4 h-4" />} label="Shopping List" />
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && <OverviewTab plan={plan} />}
        {activeTab === 'recipes' && <RecipesTab recipes={plan.recipes} />}
        {activeTab === 'prep' && <PrepGuideTab guide={plan.mealPrepGuide} />}
        {activeTab === 'shopping' && <ShoppingListTab list={plan.shoppingList} />}
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
        active 
          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 shadow-sm' 
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function OverviewTab({ plan }: { plan: MealPlan }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Calories" value={`${plan.summary.totalDailyCalories} kcal`} icon={<Flame className="w-5 h-5 text-orange-500" />} />
        <StatCard title="Daily Protein" value={`${plan.summary.totalDailyProtein}g`} icon={<Utensils className="w-5 h-5 text-blue-500" />} />
        <StatCard title="Est. Weekly Cost" value={`$${plan.summary.estimatedWeeklyCost}`} icon={<DollarSign className="w-5 h-5 text-emerald-500" />} />
        <StatCard title="Unique Ingredients" value={`${plan.summary.totalUniqueIngredients}`} icon={<ShoppingCart className="w-5 h-5 text-purple-500" />} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            Weekly Schedule
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {plan.schedule.map(day => (
            <div key={day.day} className="p-6 flex flex-col md:flex-row gap-4 md:items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="w-32 font-semibold text-slate-900 dark:text-slate-100">{day.day}</div>
              <div className="flex-1 flex flex-wrap gap-2">
                {day.meals.map((meal, idx) => {
                  const recipe = plan.recipes.find(r => r.id === meal.recipeId);
                  return (
                    <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm shadow-sm flex flex-col">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">{meal.mealName}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{recipe?.name || 'Unknown Recipe'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function RecipesTab({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {recipes.map(recipe => (
        <div key={recipe.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          {recipe.imageUrl ? (
            <div className="h-48 w-full relative">
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold leading-tight">{recipe.name}</h3>
              </div>
            </div>
          ) : (
            <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-4 text-center">
              <ChefHat className="w-8 h-8 mb-2 opacity-50" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">{recipe.name}</h3>
              <p className="text-sm mt-1">Generating image...</p>
            </div>
          )}
          
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge icon={<Clock className="w-3 h-3" />} text={`${recipe.prepTime + recipe.cookTime}m`} />
              <Badge icon={<Flame className="w-3 h-3" />} text={`${recipe.calories} kcal`} />
              <Badge text={`${recipe.protein}g P`} color="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" />
              <Badge text={`${recipe.carbs}g C`} color="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800" />
              <Badge text={`${recipe.fat}g F`} color="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" />
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wider">Ingredients</h4>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span><span className="font-medium text-slate-800 dark:text-slate-200">{ing.amount} {ing.unit}</span> {ing.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wider">Instructions</h4>
                <ul className="space-y-3">
                  {recipe.instructions.map((inst, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                      <span className="font-bold text-slate-400 dark:text-slate-500 shrink-0">{i + 1}.</span>
                      <span className="line-clamp-3 hover:line-clamp-none transition-all">{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Badge({ icon, text, color = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" }: { icon?: React.ReactNode, text: string, color?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${color}`}>
      {icon}
      {text}
    </span>
  );
}

function PrepGuideTab({ guide }: { guide: MealPlan['mealPrepGuide'] }) {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Sunday Prep Guide</h2>
        <p className="text-slate-500 dark:text-slate-400">Follow these steps to efficiently prep all your meals for the week.</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
        {guide.map((step, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {step.stepNumber}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Step {step.stepNumber}</span>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {step.timeEstimate} min
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.instruction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShoppingListTab({ list }: { list: MealPlan['shoppingList'] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {list.map((cat, idx) => (
        <div key={idx} className="break-inside-avoid bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              {cat.category}
            </h3>
          </div>
          <ul className="p-4 space-y-3">
            {cat.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <input type="checkbox" className="mt-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                <div className="flex-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{item.name}</span>
                  <span className="text-slate-400 dark:text-slate-500 text-sm block">{item.totalAmount} {item.unit}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
