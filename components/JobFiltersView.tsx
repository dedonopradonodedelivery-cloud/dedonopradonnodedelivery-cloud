import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  ChevronLeft, 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Tag, 
  Layers
} from 'lucide-react';

export interface JobFilters {
  hireTypes: string[];
  salaryMin: string;
  salaryMax: string;
  shifts: string[];
  areas: string[];
  sortBy: 'relevantes' | 'recentes' | 'maior_salario' | 'menor_salario';
}

interface JobFiltersViewProps {
  initialFilters: JobFilters;
  onApply: (filters: JobFilters) => void;
  onBack: () => void;
}

const SECTION_TITLE_CLASS = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1";

const HIRE_TYPES = ['CLT', 'Freelancer', 'PJ', 'Temporário', 'Estágio', 'Aprendiz', 'Diarista', 'Meio período', 'Outros'];
const SHIFTS = ['Manhã', 'Dia / Tarde', 'Noite', 'Madrugada'];
const AREAS = [
  'Administrativo / Secretariado / Finanças',
  'Comercial / Vendas',
  'Engenharia / Arquitetura / Designer',
  'Telecomunicação / Informática / Multimídia',
  'Atendimento ao Cliente / Call Center',
  'Banco / Seguros / Consultoria / Jurídico',
  'Logística / Distribuição',
  'Turismo / Hotelaria / Restaurante',
  'Educação / Formação',
  'Marketing / Comunicacão',
  'Serviços Domésticos / Limpeza',
  'Segurança Privada / Segurança Patrimonial',
  'Construção / Industrial',
  'Saúde / Medicina / Enfermagem',
  'Agricultura / Pecuária / Veterinária',
  'Outros'
];

export const JobFiltersView: React.FC<JobFiltersViewProps> = ({ initialFilters, onApply, onBack }) => {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [areaSearch, setAreaSearch] = useState('');

  const toggleSelection = (list: string[], item: string, field: keyof JobFilters) => {
    const newList = list.includes(item) 
      ? list.filter(i => i !== item) 
      : [...list, item];
    setFilters(prev => ({ ...prev, [field]: newList }));
  };

  const handleReset = () => {
    setFilters({
      hireTypes: [],
      salaryMin: '',
      salaryMax: '',
      shifts: [],
      areas: [],
      sortBy: 'relevantes'
    });
  };

  const filteredAreas = useMemo(() => {
    return AREAS.filter(a => a.toLowerCase().includes(areaSearch.toLowerCase()));
  }, [areaSearch]);

  return (
    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={onBack}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 pb-0 flex flex-col shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtros de Vagas</h2>
            <button onClick={onBack} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar space-y-8 p-6 pt-0">
          <section>
            <h3 className={SECTION_TITLE_CLASS}>Tipo de contratação</h3>
            <div className="flex flex-wrap gap-2">
              {HIRE_TYPES.map(type => (
                <button 
                  key={type}
                  onClick={() => toggleSelection(filters.hireTypes, type, 'hireTypes')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                    filters.hireTypes.includes(type)
                      ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className={SECTION_TITLE_CLASS}>Faixa salarial mensal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">R$</span>
                <input 
                  type="number" 
                  value={filters.salaryMin}
                  onChange={(e) => setFilters({...filters, salaryMin: e.target.value})}
                  placeholder="Mínimo" 
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">R$</span>
                <input 
                  type="number" 
                  value={filters.salaryMax}
                  onChange={(e) => setFilters({...filters, salaryMax: e.target.value})}
                  placeholder="Máximo" 
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className={SECTION_TITLE_CLASS}>Turno</h3>
            <div className="grid grid-cols-2 gap-3">
              {SHIFTS.map(shift => (
                <button 
                  key={shift}
                  onClick={() => toggleSelection(filters.shifts, shift, 'shifts')}
                  className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                    filters.shifts.includes(shift)
                      ? 'bg-[#1E5BFF]/5 border-[#1E5BFF] text-[#1E5BFF]' 
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500'
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className={SECTION_TITLE_CLASS}>Área de atuação</h3>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                placeholder="Buscar áreas ou especialidades..."
                className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 shadow-inner dark:text-white"
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {filteredAreas.map(area => (
                <button 
                  key={area}
                  onClick={() => toggleSelection(filters.areas, area, 'areas')}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${
                    filters.areas.includes(area)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 text-[#1E5BFF]'
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold text-left">{area}</span>
                  {filters.areas.includes(area) && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className={SECTION_TITLE_CLASS}>Ordenar por</h3>
            <div className="space-y-2">
              {[
                {id: 'relevantes', label: 'Mais relevantes'},
                {id: 'recentes', label: 'Mais recentes'},
                {id: 'maior_salario', label: 'Maior salário'},
                {id: 'menor_salario', label: 'Menor salário'}
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setFilters({...filters, sortBy: opt.id as any})}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 ${filters.sortBy === opt.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'border-gray-100 dark:border-gray-800 text-gray-500'}`}
                >
                  <span className="text-sm font-bold">{opt.label}</span>
                  {filters.sortBy === opt.id && <CheckCircle2 size={18} className="text-[#1E5BFF]" />}
                </button>
              ))}
            </div>
          </section>
        </main>

        <footer className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <div className="flex gap-4">
            <button onClick={handleReset} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-600 bg-gray-50 dark:bg-gray-800 rounded-2xl transition-colors">Limpar</button>
            <button onClick={() => onApply(filters)} className="flex-[2] py-4 text-xs font-black uppercase tracking-widest bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">Aplicar Filtros</button>
          </div>
        </footer>
      </div>
    </div>
  );
};