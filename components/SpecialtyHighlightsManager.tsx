
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  Image as ImageIcon, 
  Save, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Sparkles,
  CheckCircle2,
  X,
  Loader2,
  ToggleLeft as ToggleIcon
} from 'lucide-react';

interface HighlightItem {
    id: string;
    call: string;
    desc: string;
    cta: string;
    image: string | null;
    active: boolean;
    order: number;
}

export const SpecialtyHighlightsManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([
      { id: '1', call: 'Consulta Premium', desc: 'Atendimento estendido com exames.', cta: 'Ver detalhes', image: null, active: true, order: 0 },
      { id: '2', call: 'Check-up Preventivo', desc: 'Pacote especial para moradores.', cta: 'Agendar', image: null, active: true, order: 1 }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (highlights.length >= 5) {
        alert("Máximo de 5 rascunhos de destaques permitido.");
        return;
    }
    const newItem: HighlightItem = {
        id: Date.now().toString(),
        call: 'Novo Destaque',
        desc: '',
        cta: 'Saiba Mais',
        image: null,
        active: false,
        order: highlights.length
    };
    setHighlights([...highlights, newItem]);
  };

  const handleUpdate = (id: string, field: keyof HighlightItem, value: any) => {
    setHighlights(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja remover este destaque?")) {
        setHighlights(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        alert("Vitrine atualizada! Os 3 primeiros destaques ativos já estão no ar.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90">
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Gestão de Vitrine</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Destaques da Especialidade</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-90 transition-all">
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-40">
        
        <section className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30 flex gap-4">
            <Sparkles className="w-6 h-6 text-[#1E5BFF] shrink-0" />
            <p className="text-xs text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                Você pode cadastrar até 5 opções de destaque. **Os 3 primeiros marcados como ativos** aparecerão no topo da sua especialidade para os moradores.
            </p>
        </section>

        <div className="space-y-4">
            {highlights.map((h, idx) => (
                <div key={h.id} className={`bg-white dark:bg-gray-900 rounded-[2.5rem] border transition-all ${h.active ? 'border-blue-500/30 shadow-lg shadow-blue-500/5' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card #{idx + 1}</span>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleUpdate(h.id, 'active', !h.active)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${h.active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                                >
                                    {h.active ? 'Ativo' : 'Pausado'}
                                </button>
                                <button onClick={() => handleDelete(h.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            <div className="flex flex-col items-center">
                                <div className="w-full aspect-video rounded-3xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-gray-300 gap-2 cursor-pointer hover:bg-blue-50/50 transition-colors">
                                    <ImageIcon size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Subir Foto ou Logo</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Chamada Principal (Livre)</label>
                                    <input 
                                        value={h.call} 
                                        onChange={e => handleUpdate(h.id, 'call', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" 
                                        placeholder="Ex: Novo tratamento facial"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Descrição Curta</label>
                                    <textarea 
                                        value={h.desc} 
                                        onChange={e => handleUpdate(h.id, 'desc', e.target.value)}
                                        rows={2}
                                        className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" 
                                        placeholder="Opcional: detalhes da chamada"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Texto do Botão (CTA)</label>
                                    <input 
                                        value={h.cta} 
                                        onChange={e => handleUpdate(h.id, 'cta', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-xs font-black uppercase tracking-widest dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" 
                                        placeholder="Ex: Agendar Agora"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button 
                onClick={handleAdd}
                className="w-full py-6 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all bg-white dark:bg-gray-900 group"
            >
                <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Adicionar novo Card</span>
            </button>
        </div>

      </main>

      <footer className="fixed bottom-[85px] left-0 right-0 p-5 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Publicar Alterações</>}
          </button>
      </footer>
    </div>
  );
};
