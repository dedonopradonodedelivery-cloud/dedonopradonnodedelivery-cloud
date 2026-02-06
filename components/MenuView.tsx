import React from 'react';
import { ChevronRight, Zap, MessageSquare } from 'lucide-react';
import { useFeatures } from '../contexts/FeatureContext';

// Fixed: Defined MenuSection
const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">{title}</h3>
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 mx-4">
      {children}
    </div>
  </div>
);

// Fixed: Defined MenuItem
const MenuItem: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  sublabel?: string; 
  onClick: () => void; 
  color?: string;
}> = ({ icon: Icon, label, sublabel, onClick, color = "text-gray-400" }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 border-b last:border-b-0 border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-900 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{label}</p>
        {sublabel && <p className="text-[10px] text-gray-500 font-medium">{sublabel}</p>}
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-300" />
  </button>
);

export const MenuView: React.FC<{ onNavigate: (view: string, data?: any) => void }> = ({ onNavigate }) => {
  const { isFeatureActive } = useFeatures();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
        <header className="p-8 pb-4">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Menu</h1>
        </header>

          <MenuSection title="Minha atividade no bairro">
              <MenuItem 
                  icon={Zap} 
                  label="Avisar algo acontecendo" 
                  sublabel="Postagem em tempo real na Home (exige aprovação)"
                  onClick={() => onNavigate('happening_now_form')}
                  color="text-amber-500"
              />
              {isFeatureActive('community_feed') && (
                <MenuItem 
                    icon={MessageSquare} 
                    label="Meus comentários" 
                    sublabel="Histórico no JPA Conversa"
                    onClick={() => onNavigate('user_activity', { type: 'comentarios' })}
                    color="text-indigo-500"
                />
              )}
          </MenuSection>
    </div>
  );
};
