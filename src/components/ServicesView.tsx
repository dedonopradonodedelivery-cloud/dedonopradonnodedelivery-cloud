

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
    { id: 'oferta-3', title: 'Instalação de Tomadas e Pontos de Luz', type: 'home', price: 120.00, desc: 'Elétricista certificado.', image: 'https://images.unsplash.com/photo-1621905299860-e836b8ab7f84?q=80&w=400&auto=format