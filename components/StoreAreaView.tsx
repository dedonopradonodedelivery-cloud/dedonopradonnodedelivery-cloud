
import React from 'react';
import { 
  ChevronRight, 
  Megaphone, 
  LayoutGrid, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Heart, 
  Info, 
  HelpCircle, 
  LogOut,
  User,
  Sparkles,
  Compass,
  LifeBuoy,
  AlertTriangle,
  Crown,
  Star,
  Users,
  Award,
  Tag,
  Briefcase, // Adicionado para Vagas de Emprego
  Sun, // Adicionado para Modo Noite
  Moon, // Adicionado para Modo Noite
  Rocket, // FIX: Added missing Rocket icon
  Palette, // FIX: Added missing Palette icon
  Newspaper, // Ícone para Posts do Bairro
  BarChart2 // Ícone para Desempenho
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext'; // Importar useTheme

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, initialView?: 'sales' | 'chat') => void;
  user: SupabaseUser | null;
}

// Componente Visual Único e Padronizado para todos os itens do menu
const ServiceBlock: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  isDestructive?: boolean;
  colorClass?: string;
  badge?: number;
  rightElement?: React.ReactNode;
}> = ({ icon: Icon, label, description, onClick, isDestructive, colorClass, badge, rightElement }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors relative ${
        isDestructive 
          ? 'bg-red-50 text-red-500' 
          : colorClass || 'bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:text-[#1E5BFF] group-hover:bg-blue-50'
      }`}>
        <Icon size={22} />
        {badge ? (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-white">{badge}</span>
          </div>
        ) : null}
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1 max-w-[200px]">
            {description}
          </p>
        )}
      </div>
    </div>
    {rightElement || <ChevronRight size={16} className={isDestructive ? 'text-red-300' : 'text-gray-300'} />}
  </button>
);

const SectionHeader: React.FC<{