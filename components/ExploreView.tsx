import React, { useMemo } from "react";
import { Store } from "../types";
import { LojasEServicosList } from "./LojasEServicosList";
import { Compass, Filter, MapPin } from "lucide-react";

interface ExploreViewProps {
  stores: Store[];
  searchQuery: string;
  onStoreClick: (store: Store) => void;
  onLocationClick: () => void;
  onFilterClick: () => void;
  onNavigate: (view: string) => void;
  onProceedToPayment?: (days: number, total: number) => void;
  onOpenPlans?: () => void;
  onViewAllVerified?: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ 
  stores, 
  searchQuery, 
  onStoreClick, 
  onFilterClick, 
  onNavigate 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 animate-in fade-in duration-500">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF]">
              <Compass size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Explorar Bairro</h1>
              <p className="text-xs text-gray-500">Encontre o que você precisa em JPA</p>
            </div>
          </div>
          <button onClick={onFilterClick} className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Filter size={20} className="text-gray-500" />
          </button>
        </div>

        <LojasEServicosList 
          onStoreClick={onStoreClick}
          onNavigate={onNavigate}
          activeFilter="all"
        />
      </div>
    </div>
  );
};