
import React, { useMemo, useState } from "react";
import { Store } from "../types";
import { MapPin, Filter, Star, Clock, ChevronRight, Compass, BadgeCheck, Sparkles, Crown } from "lucide-react";
import { useUserLocation } from "../hooks/useUserLocation";
import { quickFilters } from "../constants";

export const ExploreView: React.FC<{ stores: Store[]; searchQuery: string; onStoreClick: (store: Store) => void; onNavigate: (view: string) => void; }> = ({ stores, searchQuery, onStoreClick, onNavigate }) => {
  const { location } = useUserLocation();
  const [sortOption, setSortOption] = useState<"nearby" | "topRated" | null>(null);

  const filteredStores = useMemo(() => {
    let filtered = [...stores];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (sortOption === "topRated") filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [stores, searchQuery, sortOption]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        {quickFilters.map((f) => (
          <button key={f.id} onClick={() => f.id === 'top_rated' && setSortOption('topRated')} className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">{f.label}</button>
        ))}
      </div>
      <div className="px-4 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Perto de você</h2>
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredStores.map(store => (
              <button key={store.id} onClick={() => onStoreClick(store)} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-left">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0"><img src={store.image} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate dark:text-white">{store.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{store.subcategory}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-xs font-bold text-yellow-500"><Star size={12} className="fill-current" />{store.rating}</span>
                    <span className="text-[10px] text-gray-400">• {store.distance}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center"><Compass className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-500 font-bold">Nenhum local encontrado</p></div>
        )}
      </div>
    </div>
  );
};
