import React from 'react';
import { ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface SpecialtiesViewProps {
  subcategoryName: string;
  onBack: () => void;
  onSelectSpecialty: (specialty: string) => void;
  onNavigate: (view: string) => void;
}

// Mock Data for Specialties based on Subcategory Name
const SPECIALTIES_DATA: Record<string, string[]> = {
  // Emergência
  'Chaveiro 24h': ['Abertura de portas', 'Troca de fechadura', 'Chave codificada', 'Abertura de cofre', 'Cópia de chaves', 'Instalação de tetra chave'],
  'Desentupidora': ['Pia de cozinha', 'Vaso sanitário', 'Caixa de gordura', 'Ralo de banheiro', 'Rede de esgoto externa', 'Limpeza de fossa'],
  'Guincho': ['Reboque leve (carro)', 'Reboque pesado', 'Pane seca', 'Troca de pneu', 'Recarga de bateria'],
  'Eletricista 24h': ['Queda de energia total', 'Curto-circuito', 'Disjuntor desarmando', 'Cheiro de queimado', 'Tomada em curto'],
  
  // Casa & Reparos
  'Eletricista': ['Instalação de chuveiro', 'Troca de fiação', 'Instalação de tomadas', 'Instalação de ventilador', 'Iluminação e lustres'],
  'Encanador': ['Vazamento em cano', 'Troca de torneira', 'Instalação de filtro', 'Reparo em descarga', 'Limpeza de caixa d\'água'],
  'Pedreiro': ['Pequenos reparos', 'Reboco e alvenaria', 'Colocação de piso/azulejo', 'Construção de muro', 'Reforma completa'],
  'Pintor': ['Pintura interna', 'Pintura externa', 'Texturas e efeitos', 'Tratamento de mofo', 'Pintura de portas e janelas'],
  'Marido de Aluguel': ['Instalação de cortina/persiana', 'Montagem de prateleiras', 'Troca de lâmpadas', 'Instalação de suporte de TV', 'Pequenos reparos gerais'],
  
  // Auto & Moto
  'Mecânico': ['Revisão geral', 'Troca de óleo', 'Suspensão e freios', 'Motor e câmbio', 'Diagnóstico eletrônico'],
  'Funilaria e Pintura': ['Martelinho de ouro', 'Polimento e cristalização', 'Pintura de peças', 'Reparo de para-choque'],
  'Auto Elétrica': ['Troca de bateria', 'Alternador e motor de arranque', 'Instalação de som/multimídia', 'Lâmpadas e faróis'],
  
  // Tecnologia
  'Conserto de Celular': ['Troca de tela', 'Troca de bateria', 'Não carrega', 'Recuperação de sistema', 'Limpeza de água'],
  'Informática': ['Formatação', 'Remoção de vírus', 'Upgrade de memória/SSD', 'Limpeza interna', 'Configuração de rede'],

  // Default Fallback
  'default': ['Consultoria', 'Orçamento geral', 'Manutenção preventiva', 'Reparo específico', 'Instalação']
};

export const SpecialtiesView: React.FC<SpecialtiesViewProps> = ({ subcategoryName, onBack, onSelectSpecialty, onNavigate }) => {
  const items = SPECIALTIES_DATA[subcategoryName] || SPECIALTIES_DATA['default'];

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{subcategoryName}</h1>
            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mt-1">Especialidades</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">

        {/* Content List */}
        <div className="p-6 pt-12">
          <div className="grid grid-cols-2 gap-4">
            {items.map((specialty, idx) => (
              <button 
                key={idx}
                onClick={() => onSelectSpecialty(specialty)}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500 bg-opacity-10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 size={32} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                  {specialty}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                  Não encontrou exatamente o que precisa?
              </p>
              <button 
                  onClick={() => onSelectSpecialty('Outro')}
                  className="mt-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                  Descrever meu problema manualmente
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
