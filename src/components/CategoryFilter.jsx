import React from 'react';
import { Grid, Pill, HeartPulse, Stethoscope, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { STORE_CONFIG } from '../config/storeConfig';

const iconMap = {
  Grid: Grid,
  Pill: Pill,
  HeartPulse: HeartPulse,
  Stethoscope: Stethoscope,
  Sparkles: Sparkles
};

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, products } = useProducts();

  const getCategoryCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none max-w-full">
      {STORE_CONFIG.categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Grid;
        const isSelected = selectedCategory === cat.id;
        const count = getCategoryCount(cat.id);

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 shadow-sm border ${
              isSelected
                ? 'bg-teal-600 text-white border-teal-600 shadow-teal-500/20 shadow-md scale-102'
                : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
            <span>{cat.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
