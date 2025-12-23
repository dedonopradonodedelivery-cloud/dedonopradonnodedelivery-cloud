

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
import { supabase } from '@/lib/supabaseClient'; // Corrected import path

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
    { id: 'oferta-4', title: 'Troca de Tela de Celular', type: 'tech', price: 250.00, desc: 'Reparo rápido e com garantia.', image: 'https://images.unsplash.com/photo-1596541223130-5d31a73bb696?q=80&w=400&auto=format&fit=crop' },
    { id: 'oferta-5', title: 'Advogado Especialista em Família', type: 'pro', price: null, desc: 'Primeira consulta gratuita.', image: 'https://images.unsplash.com/photo-1589823528246-81530d958567?q=80&w=400&auto=format&fit=crop' },
    { id: 'oferta-6', title: 'Detetização Residencial', type: 'clean', price: 300.00, desc: 'Contra baratas, formigas e cupins.', image: 'https://images.unsplash.com/photo-1581091223067-1b1b1b1b1b1b?q=80&w=400&auto=format&fit=crop' },
    { id: 'oferta-7', title: 'Alinhamento e Balanceamento', type: 'auto', price: 80.00, desc: 'Para carros de passeio.', image: 'https://images.unsplash.com/photo-1621905299860-e836b8ab7f84?q=80&w=400&auto=format&fit=crop' },
    { id: 'oferta-8', title: 'Manutenção de Computadores', type: 'tech', price: 150.00, desc: 'Formatação, limpeza e otimização.', image: 'https://images.unsplash.com/photo-1589139857948-c89b7d2f9d1d?q=80&w=400&auto=format&fit=crop' },
  ];

  const filteredOffers = searchTerm
    ? servicesOffers.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : servicesOffers;

  const handleRequestQuote = (categoryName: string) => {
    onSelectMacro('quote', categoryName); // Use a macro ID como 'quote' para indicar que é um pedido de orçamento direto
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-5 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display leading-tight mb-2">
          Serviços da Freguesia
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Encontre os melhores profissionais do seu bairro.
        </p>
        {searchTerm && (
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
            <Search className="w-4 h-4" />
            <span>Resultados para "{searchTerm}"</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-6">
        
        {/* Call to Action: Pedir Orçamento */}
        {!searchTerm && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/30 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold font-display mb-2">
                Não sabe quem chamar?
              </h2>
              <p className="text-blue-100 text-sm mb-6 max-w-[280px]">
                Descreva o que você precisa e receba orçamentos de vários profissionais.
              </p>
              <button 
                onClick={() => handleRequestQuote('Serviço Geral')} // Categoria padrão para o modal
                className="w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                Pedir Orçamento Agora
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid (Macro-categories) */}
        {!searchTerm && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
              Buscar por Categoria
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectMacro(cat.id, cat.name)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all active:scale-[0.98] min-h-[120px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-gray-600 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 text-sm text-center">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Highlighted Offers / Search Results */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
            {searchTerm ? 'Resultados da Busca' : 'Ofertas em Destaque'}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
                  <div className="w-28 h-20 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {offer.desc}
                    </p>
                    {offer.price && (
                      <p className="font-bold text-green-600 dark:text-green-400 text-sm mt-2">
                        A partir de R$ {offer.price.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                    {!offer.price && (
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-sm mt-2">
                        Solicite orçamento
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Nenhum serviço encontrado.</p>
              </div>
            )}
          </div>
        </section>

        {/* Service Terms Link */}
        <div className="pt-4 text-center">
            <button 
                onClick={onOpenTerms}
                className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
            >
                Ver termos de uso dos serviços
            </button>
        </div>

      </div>
    </div>
  );
};