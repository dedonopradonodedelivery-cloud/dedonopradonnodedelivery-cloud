

import React, { useState, useEffect, useRef } from 'react';
import { 
  TriangleAlert, 
  Hammer, 
  CarFront, 
  Smartphone, 
  Dog, 
  Sparkles, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Shield,
  Zap,
  Flame,
  Star,
  ShieldCheck,
  Clock,
  MessageSquare,
  MessageCircle,
  Phone,
  BarChart3,
  MoreHorizontal, // Import MoreHorizontal as it's used in the component
  FileText, // Import FileText
  Search // Import Search
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ServicesViewProps {
  onSelectMacro: (id: string, name: string) => void; // Added return type void
  onOpenTerms: () => void;
  onNavigate: (view: string) => void;
  searchTerm?: string;
}

// Fixed: Export the ServicesView component
export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectMacro, onOpenTerms, onNavigate, searchTerm }) => {
  const categories = [
    { id: 'emergency', name: 'Emergência 24h', icon: <TriangleAlert className="w-6 h-6 text-red-500" /> },
    { id: 'home', name: 'Casa & Reparos', icon: <Hammer className="w-6 h-6 text-orange-500" /> },
    { id: 'auto', name: 'Auto & Moto', icon: <CarFront className="w-6 h-6 text-blue-500" /> },
    { id: 'tech', name: 'Tecnologia', icon: <Smartphone className="w-6 h-6 text-purple-500" /> },
    { id: 'pet', name: 'Pets', icon: <Dog className="w-6 h-6 text-amber-500" /> },
    { id: 'clean', name: 'Limpeza', icon: <Sparkles className="w-6 h-6 text-cyan-500" /> },
    { id: 'pro', name: 'Profissionais', icon: <Briefcase className="w-6 h-6 text-green-500" /> },
    { id: 'other', name: 'Outros Serviços', icon: <MoreHorizontal className="w-6 h-6 text-gray-500" /> },
  ];

  const servicesOffers = [
    { id: 'oferta-1', title: 'Manutenção de Ar-condicionado', type: 'home', price: 180.00, desc: 'Limpeza e recarga de gás.', image: 'https://images.unsplash.com/photo-1589139857948-c89b7d2f9d1d?q=80&w=400&auto=format&fit=crop' },
    { id: 'oferta-2', title: 'Banho e Tosa Completo', type: 'pet', price: 75.00, desc: 'Inclui hidratação e corte de unhas.', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop' },
    { id: 'oferta-3', title: 'Instalação de Tomadas e Pontos de Luz', type: 'home', price: 120.00, desc: 'Elétricista certificado.', image: 'https://images.unsplash.com/photo-1621905299860-e836b8ab7f84?q=80&w=400&auto=format&fit=crop' },
  ];

  const filteredCategories = searchTerm
    ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories;

  const filteredOffers = searchTerm
    ? servicesOffers.filter(offer => offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || offer.desc.toLowerCase().includes(searchTerm.toLowerCase()))
    : servicesOffers;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in slide-in-from-right duration-300">
      
      {!searchTerm && (
        <>
          <div className="bg-white dark:bg-gray-900 px-5 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 flex items-center justify-between">
              <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display leading-tight">
                    Serviços
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Encontre profissionais verificados no bairro
                  </p>
              </div>
              <button 
                onClick={onOpenTerms}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> Termos
              </button>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
              Categorias
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onSelectMacro(cat.id, cat.name)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-[0.98] min-h-[120px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-gray-600 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 text-sm text-center leading-tight">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Seção de Ofertas em Destaque */}
      {(searchTerm ? filteredOffers.length > 0 : servicesOffers.length > 0) && (
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            {searchTerm ? 'Ofertas encontradas' : 'Ofertas em Destaque'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {(searchTerm ? filteredOffers : servicesOffers).map(offer => (
              <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 flex gap-4 cursor-pointer hover:shadow-md transition-all">
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{offer.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{offer.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900 dark:text-white text-lg">R$ {offer.price.toFixed(2).replace('.', ',')}</span>
                    <button className="flex items-center gap-1.5 bg-[#1E5BFF] text-white text-xs font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform">
                      Pedir <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm && filteredCategories.length === 0 && filteredOffers.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nenhum resultado</h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">Tente buscar por um termo diferente ou explorar as categorias acima.</p>
        </div>
      )}

      <div className="p-5 pt-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
          Precisa de ajuda com seu negócio?
        </h3>
        <div 
          onClick={() => onNavigate('business_registration_flow')} 
          className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF] shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Seu negócio no Localizei</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Anuncie, atraia clientes e gerencie leads.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
        </div>
      </div>
    </div>
  );
};