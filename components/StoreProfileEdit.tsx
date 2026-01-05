
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Camera, 
  Save,
  MessageSquare,
  Star,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Instagram,
  Store,
  CreditCard,
  Banknote,
  QrCode,
  Landmark,
  Ticket,
  Check,
  AtSign
} from 'lucide-react';

interface StoreProfileEditProps {
  onBack: () => void;
}

const RESERVED_USERNAMES = ['admin', 'suporte', 'freguesia', 'localizei', 'oficial', 'moderacao', 'staff'];

const PAYMENT_OPTIONS = [
  { id: 'pix', label: 'Pix', icon: QrCode },
  { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
  { id: 'credito', label: 'Cartão de Crédito', icon: CreditCard },
  { id: 'debito', label: 'Cartão de Débito', icon: CreditCard },
  { id: 'vale', label: 'VR / VA', icon: Ticket },
  { id: 'transferencia', label: 'Transferência', icon: Landmark },
];

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form State
  const [isPublic, setIsPublic] = useState(true);
  const [username, setUsername] = useState('hamburgueriabrasa');
  const [formData, setFormData] = useState({
    name: 'Hamburgueria Brasa',
    category: 'Alimentação',
    subcategory: 'Hamburgueria',
    address: 'Rua Araguaia, 450 - Freguesia',
    phone: '(21) 99999-8888',
    whatsapp: '(21) 99999-8888',
    instagram: '@hamburgueriabrasa',
    site: 'www.brasa.com.br',
    description: 'O melhor burger artesanal do bairro. Ingredientes selecionados, carne fresca e um ambiente familiar pensado para você.',
  });

  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [usernameError, setUsernameError] = useState('');

  const [paymentMethods, setPaymentMethods] = useState<string[]>(['pix', 'dinheiro', 'credito', 'debito']);

  const [hours, setHours] = useState([
    { day: 'Segunda', open: false, start: '00:00', end: '00:00' },
    { day: 'Terça', open: true, start: '18:00', end: '23:00' },
    { day: 'Quarta', open: true, start: '18:00', end: '23:00' },
    { day: 'Quinta', open: true, start: '18:00', end: '23:00' },
    { day: 'Sexta', open: true, start: '18:00', end: '00:00' },
    { day: 'Sábado', open: true, start: '18:00', end: '00:00' },
    { day: 'Domingo', open: true, start: '18:00', end: '23:00' },
  ]);

  // Simula carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- USERNAME LOGIC (Shared logic concept) ---
  const validateUsername = (val: string) => {
    const regex = /^[a-z0-9._]{3,20}$/;
    if (!val) return 'Obrigatório';
    if (val.length < 3) return 'Mínimo 3 caracteres';
    if (val.length > 20) return 'Máximo 20 caracteres';
    if (!regex.test(val)) return 'Apenas letras minúsculas, números, ponto e underline.';
    if (RESERVED_USERNAMES.includes(val)) return '@ Indisponível (Reservado)';
    return '';
  };

  const generateSuggestions = (base: string) => {
    const cleanBase = base.replace(/[^a-z0-9]/g, '');
    return [
      `${cleanBase}_oficial`,
      `${cleanBase}.freguesia`,
      `${cleanBase}_loja`
    ];
  };

  const checkAvailability = async (val: string) => {
    setUsernameStatus('checking');
    await new Promise(r => setTimeout(r, 600));

    // Mock Taken Usernames
    const mockTaken = ['admin', 'padaria', 'farmacia', 'loja'];
    
    if (mockTaken.includes(val)) {
      setUsernameStatus('taken');
      setSuggestions(generateSuggestions(val));
      setUsernameError('Esse @ já existe');
    } else {
      setUsernameStatus('available');
      setUsernameError('');
      setSuggestions([]);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s/g, '');
    setUsername(val);
    
    const error = validateUsername(val);
    if (error) {
      setUsernameStatus('invalid');
      setUsernameError(error);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(() => checkAvailability(val), 800);
    return () => clearTimeout(timer);
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (usernameStatus === 'taken' || usernameStatus === 'invalid') return;

    setIsSaving(true);
    // Simula API
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Carregando dados da loja...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in fade-in duration-300 pb-32">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-1">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white font-display">Perfil Público da Loja</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Essas informações são visíveis para os clientes</p>
            </div>
        </div>
      </div>

      <div className="p-5 space-y-8">
        
        {/* 1. VISIBILIDADE STATUS */}
        <section className={`p-5 rounded-3xl border transition-all duration-300 ${isPublic ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30' : 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/30'}`}>
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPublic ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                   {isPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">
                     Status: Perfil {isPublic ? 'Ativo' : 'Oculto'}
                   </p>
                   <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                     {isPublic ? 'Sua loja aparece nas buscas' : 'Sua loja está invisível no app'}
                   </p>
                </div>
             </div>
             <button 
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isPublic ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
             >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isPublic ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
            "Essas informações aparecem para clientes que encontrarem sua loja no app."
          </p>
        </section>

        {/* 2. IMAGENS (LOGO E CAPA) */}
        <section className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Identidade Visual</h3>
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Logo</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-20 rounded-2xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Foto de Capa</span>
                </div>
            </div>
        </section>

        {/* 3. DADOS BÁSICOS */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
            <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-[#1E5BFF]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Dados da Loja</h3>
            </div>
            
            {/* USERNAME FIELD */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">@ da loja (Username)</label>
                <div className="relative group">
                    <AtSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${usernameStatus === 'available' ? 'text-green-500' : 'text-gray-400'}`} />
                    <input 
                        type="text" 
                        value={username}
                        onChange={handleUsernameChange}
                        className={`w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pl-12 pr-10 py-4 rounded-2xl border outline-none transition-all font-bold lowercase ${
                            usernameStatus === 'invalid' || usernameStatus === 'taken' 
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : usernameStatus === 'available' 
                                ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                : 'border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF]'
                        }`}
                        placeholder="nome.da.loja"
                        autoComplete="off"
                        autoCapitalize="none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 text-[#1E5BFF] animate-spin" />}
                        {usernameStatus === 'available' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <AlertCircle className="w-5 h-5 text-red-500" />}
                    </div>
                </div>
                
                {/* Feedback & Suggestions */}
                <div className="min-h-[20px] ml-1">
                    {usernameStatus === 'available' && (
                        <p className="text-xs text-green-600 font-bold">@ disponível ✅</p>
                    )}
                    {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                        <p className="text-xs text-red-500 font-bold">{usernameError}</p>
                    )}
                    {usernameStatus === 'taken' && suggestions.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Sugestões disponíveis:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map(sug => (
                                    <button 
                                        key={sug}
                                        type="button"
                                        onClick={() => {
                                            setUsername(sug);
                                            setUsernameStatus('available');
                                            setUsernameError('');
                                            setSuggestions([]);
                                        }}
                                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 font-bold hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                                    >
                                        @{sug}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Comercial</label>
                <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF] outline-none transition-all dark:text-white font-medium"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-white font-medium"
                >
                    <option>Alimentação</option>
                    <option>Serviços</option>
                    <option>Varejo</option>
                    <option>Saúde</option>
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Curta</label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF] outline-none transition-all dark:text-white font-medium resize-none text-sm leading-relaxed"
                />
            </div>
        </section>

        {/* 4. FORMAS DE PAGAMENTO */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
            <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-[#1E5BFF]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Formas de Pagamento</h3>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">Selecione quais meios de pagamento você aceita no local.</p>

            <div className="grid grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map((option) => {
                    const isSelected = paymentMethods.includes(option.id);
                    return (
                        <button
                            key={option.id}
                            onClick={() => togglePaymentMethod(option.id)}
                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all active:scale-[0.95] text-left relative overflow-hidden ${
                                isSelected 
                                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-[#1E5BFF] dark:text-blue-300' 
                                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            <option.icon className={`w-5 h-5 ${isSelected ? 'text-[#1E5BFF]' : 'text-gray-400'}`} />
                            <span className="text-xs font-bold leading-tight">{option.label}</span>
                            {isSelected && (
                                <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5 shadow-sm">
                                    <Check className="w-2 h-2 text-white" strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>

        {/* 5. CONTATO E REDES */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
            <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#1E5BFF]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Contato e Endereço</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full p-4 pl-11 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-white text-sm" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instagram</label>
                    <div className="relative">
                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full p-4 pl-11 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-white text-sm" />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Endereço Público</label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input name="address" value={formData.address} onChange={handleInputChange} className="w-full p-4 pl-11 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 outline-none dark:text-white text-sm" />
                </div>
            </div>
        </section>

        {/* 6. HORÁRIOS */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#1E5BFF]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Horário de Funcionamento</h3>
            </div>
            
            <div className="space-y-3">
                {hours.map((h, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-gray-500 w-12">{h.day.slice(0,3)}</span>
                        <div className={`flex-1 flex items-center gap-2 p-2 rounded-xl border ${h.open ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700' : 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-40'}`}>
                           {h.open ? (
                               <>
                                   <input type="time" defaultValue={h.start} className="bg-transparent text-xs font-bold dark:text-white w-full text-center outline-none" />
                                   <span className="text-gray-300">-</span>
                                   <input type="time" defaultValue={h.end} className="bg-transparent text-xs font-bold dark:text-white w-full text-center outline-none" />
                               </>
                           ) : (
                               <span className="text-[10px] font-black uppercase text-gray-400 w-full text-center">Fechado</span>
                           )}
                        </div>
                        <button 
                            onClick={() => {
                                const newHours = [...hours];
                                newHours[i].open = !newHours[i].open;
                                setHours(newHours);
                            }}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${h.open ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}
                        >
                            {h.open ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                    </div>
                ))}
            </div>
        </section>

      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-40 flex flex-col gap-2 max-w-md mx-auto">
        {showSuccess && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm mb-2 animate-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-4 h-4" /> Dados atualizados com sucesso!
            </div>
        )}
        <button 
            onClick={handleSave}
            disabled={isSaving || (usernameStatus !== 'available' && usernameStatus !== 'idle')}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Salvar alterações
        </button>
      </div>

    </div>
  );
};
