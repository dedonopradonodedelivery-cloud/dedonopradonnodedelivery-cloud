
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  Store as StoreIcon, 
  Loader2, 
  Save, 
  X, 
  ChevronDown, 
  Search, 
  PlusCircle, 
  Pencil, 
  Building2, 
  Check,
  Smartphone,
  ImageIcon,
  DollarSign,
  Video,
  Plus,
  Clock,
  Instagram,
  CheckCircle2,
  MapPin,
  Tag,
  CreditCard,
  Phone,
  AlertCircle,
  Hash,
  FileText,
  Mail,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES } from '../constants';
import { BusinessHour } from '../types';

interface StoreProfileEditProps {
  onBack: () => void;
}

const WEEK_DAYS = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca', label: 'Terça-feira' },
  { key: 'quarta', label: 'Quarta-feira' },
  { key: 'quinta', label: 'Quarta-feira' },
  { key: 'sexta', label: 'Sexta-feira' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

const PAYMENT_METHODS = [
    { id: 'dinheiro', label: 'Dinheiro' },
    { id: 'pix', label: 'PIX' },
    { id: 'credito', label: 'Cartão de Crédito' },
    { id: 'debito', label: 'Cartão de Débito' },
];

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  'Comida': ['pizza', 'delivery', 'almoço', 'lanche', 'comida caseira', 'restaurante', 'marmita', 'café', 'sobremesa', 'self-service', 'japonês', 'hambúrguer', 'pão', 'bebidas', 'açai', 'doces', 'massas', 'churrasco', 'vegetariano', 'petiscos'],
  'Serviços': ['manutenção', 'conserto', 'atendimento rápido', 'orçamento', 'instalação', 'reparo', 'serviço local', 'residencial', 'predial', 'chaveiro', 'elétrica', 'hidráulica', 'limpeza', 'dedetização', 'segurança', 'marcenaria', 'pintura', 'vidraçaria', 'ar condicionado', 'montagem'],
  'Saúde': ['clínica', 'consulta', 'bem-estar', 'estética', 'saúde preventiva', 'atendimento especializado', 'médico', 'dentista', 'fisioterapia', 'exames', 'nutrição', 'psicologia', 'terapias', 'hospital', 'laboratório', 'pediatria', 'cardiologia', 'odontologia', 'saúde mental', 'farmácia'],
  'Autos': ['mecânica', 'troca de óleo', 'revisão', 'funilaria', 'auto center', 'oficina', 'alinhamento', 'balanceamento', 'lavajato', 'peças', 'pneus', 'auto elétrica', 'guincho', 'insulfilm', 'estofamento', 'suspensão', 'freios', 'ar condicionado automotivo', 'venda de carros', 'motos'],
  'Pets': ['pet shop', 'veterinário', 'banho e tosa', 'ração', 'acessórios pet', 'clínica veterinária', 'adestramento', 'passeador', 'hotel pet', 'creche pet', 'gatos', 'cachorros', 'aves', 'peixes', 'medicamentos pet', 'cirurgia veterinária', 'urgência pet', 'estética pet', 'vacinacao', 'castracao'],
  'Beleza': ['salão de beleza', 'barbearia', 'corte de cabelo', 'manicure', 'pedicure', 'maquiagem', 'estética facial', 'estética corporal', 'sobrancelha', 'cílios', 'depilação', 'penteado', 'coloração', 'escova', 'massagem', 'dia de noiva', 'limpeza de pele', 'unhas em gel', 'barba', 'hidratação'],
  'Casa': ['móveis', 'decoração', 'reforma', 'material de construção', 'iluminação', 'jardinagem', 'utensílios domésticos', 'cama mesa e banho', 'eletrodomésticos', 'marcenaria', 'arquitetura', 'design de interiores', 'cortinas', 'tapetes', 'organização', 'limpeza residencial', 'pintura', 'reparos', 'ferramentas', 'piscina'],
  'Educação': ['escola', 'curso', 'idiomas', 'reforço escolar', 'aula particular', 'infantil', 'profissionalizante', 'música', 'dança', 'esportes', 'artes', 'tecnologia', 'preparatório', 'concursos', 'vestibular', 'ead', 'presencial', 'capacitação', 'treinamento', 'workshop'],
  'Moda': ['roupas', 'feminina', 'masculina', 'infantil', 'calçados', 'acessórios', 'bolsas', 'moda íntima', 'fitness', 'praia', 'brechó', 'alfaiataria', 'costura', 'tênis', 'vestidos', 'jeans', 'camisetas', 'óculos', 'relógios', 'joias'],
  'Lazer': ['eventos', 'festas', 'aluguel de espaço', 'buffet', 'animação', 'decoração de festas', 'clube', 'parque', 'turismo', 'viagem', 'hospedagem', 'espetáculo', 'teatro', 'cinema', 'show', 'excursão', 'lazer infantil', 'recreação', 'gastronomia', 'cultura'],
  'Condomínio': ['administradora', 'síndico', 'manutenção predial', 'limpeza', 'segurança', 'portaria', 'jardinagem', 'reforma', 'pintura', 'elevadores', 'piscina', 'sistema de câmeras', 'interfone', 'limpeza de caixa d’água', 'dedetização', 'jurídico', 'contabilidade', 'facilities', 'bompet', 'coleta seletiva'],
  'Mercado': ['supermercado', 'minimercado', 'hortifruti', 'padaria', 'açougue', 'bebidas', 'conveniência', 'produtos naturais', 'suplementos', 'limpeza', 'higiene', 'congelados', 'latas e conservas', 'biscoitos', 'leite e derivados', 'adega', 'vinho', 'cerveja', 'importados', 'cestas de natal'],
  'Farmácia': ['medicamentos', 'genéricos', 'perfumaria', 'higiene', 'cosméticos', 'suplementos', 'manipulação', 'fraldas', 'cuidados pessoais', 'saúde', 'curativos', 'dermocosméticos', 'beleza', 'infantil', 'primeiros socorros', 'termômetro', 'vitaminas', 'emagrecimento', 'ortopédicos', 'testes rápidos'],
  'Esportes': ['academia', 'treino', 'crossfit', 'yoga', 'pilates', 'lutas', 'natação', 'futebol', 'vôlei', 'beach tennis', 'dança', 'funcional', 'personal trainer', 'artigos esportivos', 'suplementos', 'emagrecimento', 'saúde', 'esporte infantil', 'quadra', 'atletismo'],
  'Profissionais': ['advogado', 'contador', 'arquiteto', 'engenheiro', 'médico', 'dentista', 'psicólogo', 'nutricionista', 'veterinário', 'designer', 'desenvolvedor', 'corretor', 'fotógrafo', 'consultor', 'professor', 'tradutor', 'manicure', 'eletricista', 'encanador', 'pedreiro'],
  'Eventos': ['festa', 'casamento', 'aniversário', 'buffet', 'decoração', 'espaço para eventos', 'aluguel de brinquedos', 'som e luz', 'dj', 'fotógrafo', 'filmagens', 'cerimonialista', 'doces finos', 'bolo', 'convites', 'lembrancinhas', 'trajes', 'maquiagem', 'música ao vivo', 'barman']
};

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState('');

  // --- STATE DO FORMULÁRIO UNIFICADO (PÚBLICO + FISCAL) ---
  const [formData, setFormData] = useState({
    // Públicos
    nome_exibido: '',
    category: '',
    subcategory: '',
    bairro: '',
    rua: '',
    numero: '',
    cidade: 'Rio de Janeiro',
    description: '',
    whatsapp_publico: '',
    telefone_fixo_publico: '',
    instagram: '',
    email_publico: '',
    logo_url: '',
    banner_url: '',
    tags: [] as string[],
    payment_methods: [] as string[],
    payment_other: '',
    accepts_online_orders: false,
    min_order_value: '',
    business_hours: WEEK_DAYS.reduce((acc, day) => ({ 
      ...acc, 
      [day.key]: { open: true, start: '09:00', end: '18:00' } 
    }), {} as Record<string, BusinessHour>),
    confirm_correct: false,

    // Fiscais (Uso Interno)
    razao_social: '',
    cnpj: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    fiscal_address: '',
    email_fiscal: ''
  });

  useEffect(() => {
    if (!user) return;
    const fetchStoreData = async () => {
      try {
        const { data } = await supabase.from('merchants').select('*').eq('owner_id', user.id).maybeSingle();
        if (data) {
          setFormData(prev => ({
            ...prev,
            ...data,
            business_hours: data.business_hours || prev.business_hours,
            tags: data.tags || [],
            payment_methods: data.payment_methods || [],
            min_order_value: data.min_order_value ? String(data.min_order_value) : ''
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  // --- LÓGICA DE TAGS (ENTER PARA CRIAR) ---
  const handleAddTag = (val: string) => {
    const cleanVal = val.trim().toLowerCase();
    if (cleanVal && !formData.tags.includes(cleanVal) && formData.tags.length < 15) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, cleanVal] }));
    }
  };

  const removeTag = (t: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }));
  };

  const togglePayment = (id: string) => {
    setFormData(prev => ({
        ...prev,
        payment_methods: prev.payment_methods.includes(id) 
            ? prev.payment_methods.filter(m => m !== id)
            : [...prev.payment_methods, id]
    }));
  };

  const handleSave = async () => {
    if (!formData.nome_exibido || !formData.whatsapp_publico || !formData.bairro || !formData.category) {
      alert('Preencha os campos obrigatórios (*)');
      return;
    }
    if (!formData.confirm_correct) {
      alert('Você precisa confirmar que as informações estão corretas.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('merchants').upsert({
        owner_id: user?.id,
        ...formData,
        min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'owner_id' });
      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { alert('Erro ao salvar.'); } finally { setIsSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData({ ...formData, logo_url: reader.result as string });
    reader.readAsDataURL(file);
  };

  const suggestedTags = useMemo(() => {
    if (!formData.category) return [];
    const suggestions = CATEGORY_SUGGESTIONS[formData.category] || [];
    return suggestions.filter(t => !formData.tags.includes(t)).slice(0, 20);
  }, [formData.category, formData.tags]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors"><ChevronLeft size={20} className="text-gray-800 dark:text-white" /></button>
        <div className="flex-1"><h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Dados da Loja</h1></div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl active:scale-90 transition-all">{isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}</button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* --- DADOS PÚBLICOS --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><StoreIcon size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">1. Perfil Público (Visível)</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-blue-50 dark:bg-gray-800 border-2 border-dashed border-blue-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-2" /> : <StoreIcon className="text-blue-200" size={32} />}
                    </div>
                    <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#1E5BFF] text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900"><Pencil size={16} /></button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-4 text-center leading-tight">Logotipo <br/><span className="text-[8px] opacity-60">Aparece na busca e no perfil</span></p>
             </div>
             
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Nome Fantasia *</label>
                <input required value={formData.nome_exibido} onChange={e => setFormData({...formData, nome_exibido: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF]" placeholder="Ex: Padaria do Bairro" />
             </div>

             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">WhatsApp Comercial *</label>
                <input required value={formData.whatsapp_publico} onChange={e => setFormData({...formData, whatsapp_publico: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="(21) 99999-0000" />
                <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">Gera botão de contato direto no seu perfil.</p>
             </div>

             <div className="grid grid-cols-4 gap-3">
                 <div className="col-span-3">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Rua *</label>
                    <input required value={formData.rua} onChange={e => setFormData({...formData, rua: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Av. Geremário Dantas" />
                 </div>
                 <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Nº *</label>
                    <input required value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="100" />
                 </div>
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Bairro *</label>
                <select required value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none">
                    <option value="">Selecione...</option>
                    {['Freguesia', 'Taquara', 'Anil', 'Pechincha', 'Tanque', 'Curicica'].map(h => <option key={h} value={h}>{h}</option>)}
                </select>
             </div>
          </div>
        </section>

        {/* --- HORÁRIOS --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Clock size={16} className="text-amber-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">2. Horário de Funcionamento</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-4">
             {WEEK_DAYS.map(day => (
                 <div key={day.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                        <div onClick={() => setFormData(prev => ({...prev, business_hours: {...prev.business_hours, [day.key]: {...prev.business_hours[day.key], open: !prev.business_hours[day.key].open}}}))} className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${formData.business_hours[day.key].open ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {formData.business_hours[day.key].open && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{day.label}</span>
                    </div>
                    <div className={`flex items-center gap-2 transition-opacity ${!formData.business_hours[day.key].open && 'opacity-20 pointer-events-none'}`}>
                        <input type="time" value={formData.business_hours[day.key].start} onChange={e => setFormData(prev => ({...prev, business_hours: {...prev.business_hours, [day.key]: {...prev.business_hours[day.key], start: e.target.value}}}))} className="bg-blue-50/50 dark:bg-gray-800 p-2 rounded-lg text-xs font-bold" />
                        <span className="text-gray-400">-</span>
                        <input type="time" value={formData.business_hours[day.key].end} onChange={e => setFormData(prev => ({...prev, business_hours: {...prev.business_hours, [day.key]: {...prev.business_hours[day.key], end: e.target.value}}}))} className="bg-blue-50/50 dark:bg-gray-800 p-2 rounded-lg text-xs font-bold" />
                    </div>
                 </div>
             ))}
          </div>
        </section>

        {/* --- FORMAS DE PAGAMENTO --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><CreditCard size={16} className="text-emerald-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">3. Formas de Pagamento</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-4">
             <div className="grid grid-cols-2 gap-3">
                 {PAYMENT_METHODS.map(m => (
                     <div key={m.id} onClick={() => togglePayment(m.id)} className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${formData.payment_methods.includes(m.id) ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.payment_methods.includes(m.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {formData.payment_methods.includes(m.id) && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight text-gray-700 dark:text-gray-300">{m.label}</span>
                     </div>
                 ))}
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 mt-4">Outras Formas</label>
                <input value={formData.payment_other} onChange={e => setFormData({...formData, payment_other: e.target.value})} className="w-full p-4 bg-blue-50/30 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Ex: VR, Sodexo, Ticket..." />
             </div>
             <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">Ajuda o cliente na decisão de contato.</p>
          </div>
        </section>

        {/* --- CLASSIFICAÇÃO E BUSCA --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Hash size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">4. Indexação e Busca</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Categoria Principal *</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none">
                    <option value="">Selecione...</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
             </div>

             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Tags de Busca (ENTER para criar) *</label>
                <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput); setTagInput(''); } }}
                    placeholder="Ex: pizza, delivery, massa..." 
                    className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" 
                />
                
                {/* TAGS SELECIONADAS */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map(t => (
                        <div key={t} className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                            {t}
                            <button onClick={() => removeTag(t)}><X size={12} /></button>
                        </div>
                    ))}
                </div>

                {/* TAGS SUGERIDAS DINÂMICAS */}
                {suggestedTags.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Sugestões para {formData.category}</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map(tag => (
                                <button 
                                    key={tag}
                                    type="button"
                                    onClick={() => handleAddTag(tag)}
                                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase transition-all hover:border-blue-500 hover:text-blue-500 active:scale-95"
                                >
                                    + {tag}
                                </button>
                            ))}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-4 ml-1 font-medium">Clique nas sugestões para adicionar rapidamente suas tags de busca.</p>
                    </div>
                )}
                
                <p className="text-[9px] text-blue-500 mt-2 ml-1 font-bold">As tags ajudam sua loja a aparecer na barra de busca. <br/>Limite: 15 tags.</p>
             </div>

             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Descrição Curta *</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Escreva uma breve apresentação da sua loja..." className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-medium dark:text-white outline-none min-h-[120px] resize-none" />
             </div>
          </div>
        </section>

        {/* --- DADOS FISCAIS (NOVO - CENTRALIZADO) --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><FileText size={16} className="text-slate-500" /><h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">5. Dados para Nota Fiscal (Uso Interno)</h2></div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
             <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex gap-4">
                <Info size={20} className="text-amber-600 shrink-0 mt-1" />
                <p className="text-[10px] text-amber-800 dark:text-amber-200 font-bold leading-relaxed">
                  Estes dados são utilizados exclusivamente para faturamento de serviços e emissão de NF. <strong className="uppercase">Não ficam visíveis para os clientes.</strong>
                </p>
             </div>

             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Razão Social</label>
                <input value={formData.razao_social} onChange={e => setFormData({...formData, razao_social: e.target.value.toUpperCase()})} className="w-full p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="RAZÃO SOCIAL DA EMPRESA LTDA" />
             </div>

             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">CNPJ</label>
                <input value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="00.000.000/0001-00" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Insc. Estadual</label>
                    <input value={formData.inscricao_estadual} onChange={e => setFormData({...formData, inscricao_estadual: e.target.value})} className="w-full p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Opcional" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Insc. Municipal</label>
                    <input value={formData.inscricao_municipal} onChange={e => setFormData({...formData, inscricao_municipal: e.target.value})} className="w-full p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Opcional" />
                </div>
             </div>

             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">E-mail Fiscal / Faturamento</label>
                <input value={formData.email_fiscal} onChange={e => setFormData({...formData, email_fiscal: e.target.value})} className="w-full p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="financeiro@empresa.com.br" />
             </div>
          </div>
        </section>

        {/* --- CONFIRMAÇÃO --- */}
        <section className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm">
                <label className="flex items-center gap-4 cursor-pointer group">
                    <div onClick={() => setFormData({...formData, confirm_correct: !formData.confirm_correct})} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.confirm_correct ? 'bg-[#1E5BFF] border-[#1E5BFF]' : 'border-gray-200 group-hover:border-blue-400'}`}>
                        {formData.confirm_correct && <Check size={16} className="text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">Confirmo que as informações acima (públicas e fiscais) estão corretas e atualizadas.</span>
                </label>

                <button 
                  onClick={handleSave} 
                  disabled={isSaving || !formData.confirm_correct}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm mt-8 disabled:opacity-30 disabled:grayscale"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20}/> Salvar Dados da Loha</>}
                </button>
            </div>
        </section>

      </div>
      
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 size={56} className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Loja Atualizada!</span>
        </div>
      )}
    </div>
  );
};
