import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Settings2, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronLeft,
  Save,
  Clock3,
  MapPin,
  Globe,
  Home,
  MessageSquare,
  History,
  Check,
  X,
  User,
  ShieldCheck
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: string;
  type: 'presencial' | 'domiciliar' | 'online';
}

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'canceled';
}

export const MerchantSchedulingModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings State
  const [days, setDays] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [breakTime, setBreakTime] = useState('');
  const [defaultDuration, setDefaultDuration] = useState('30min');
  const [customMessage, setCustomMessage] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [confirmationType, setConfirmationType] = useState<'auto' | 'manual'>('manual');
  
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Consulta Geral', duration: '30min', type: 'presencial' }
  ]);
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', clientName: 'Carlos Silva', serviceName: 'Consulta Geral', date: '2024-05-20', time: '10:00', status: 'pending' },
    { id: '2', clientName: 'Maria Oliveira', serviceName: 'Consulta Geral', date: '2024-05-20', time: '11:00', status: 'confirmed' }
  ]);

  const toggleDay = (day: string) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const addService = () => {
    const newService: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      duration: defaultDuration,
      type: 'presencial'
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: 'confirmed' | 'canceled') => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  if (!isActive) {
    return (
      <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
        <header className="bg-white dark:bg-gray-950 px-6 py-6 border-b border-blue-100 dark:border-gray-800 flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Agendamento Localizei</h1>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-6 shadow-xl shadow-blue-500/10">
            <Calendar size={48} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tighter">Organize sua Agenda</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 max-w-xs leading-relaxed">
            Ative o sistema de agendamento para permitir que seus clientes marquem horários diretamente pelo Localizei.
          </p>
          
          <button 
            onClick={() => setIsActive(true)}
            className="w-full max-w-xs bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <CheckCircle2 size={20} />
            ATIVAR AGENDAMENTO
          </button>
          
          <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            <ShieldCheck size={14} />
            Recurso exclusivo para parceiros verificados
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500 pb-20">
      <header className="bg-white dark:bg-gray-950 px-6 py-6 border-b border-blue-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Agendamento</h1>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-2xl transition-all ${showSettings ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}
        >
          <Settings2 size={20} />
        </button>
      </header>

      <main className="flex-1 p-5 space-y-6 overflow-y-auto">
        {showSettings ? (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            {/* Configurações Básicas */}
            <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-blue-100 dark:border-gray-800">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock3 size={14} /> Configurações Básicas
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Dias de Atendimento</label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <button 
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black uppercase transition-all border ${
                          days.includes(day) 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Início</label>
                    <input 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Término</label>
                    <input 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Intervalo (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 12:00 às 13:00"
                    value={breakTime}
                    onChange={(e) => setBreakTime(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Duração Padrão</label>
                  <select 
                    value={defaultDuration}
                    onChange={(e) => setDefaultDuration(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="30min">30 minutos</option>
                    <option value="45min">45 minutos</option>
                    <option value="1h">1 hora</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Cadastro de Serviços */}
            <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-blue-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                  <Plus size={14} /> Cadastro de Serviços
                </h3>
                <button onClick={addService} className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl">
                  Adicionar
                </button>
              </div>

              <div className="space-y-4">
                {services.map(service => (
                  <div key={service.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <input 
                        type="text" 
                        placeholder="Nome do Serviço"
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                        className="bg-transparent text-sm font-black text-gray-900 dark:text-white outline-none flex-1"
                      />
                      <button onClick={() => removeService(service.id)} className="text-red-500 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-[10px] font-bold outline-none"
                      >
                        <option value="30min">30 min</option>
                        <option value="1h">1h</option>
                        <option value="1h30min">1h 30min</option>
                      </select>
                      <select 
                        value={service.type}
                        onChange={(e) => updateService(service.id, 'type', e.target.value as any)}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-[10px] font-bold outline-none"
                      >
                        <option value="presencial">Presencial</option>
                        <option value="domiciliar">Domiciliar</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mensagem e Limites */}
            <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-blue-100 dark:border-gray-800">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MessageSquare size={14} /> Instruções e Limites
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mensagem Personalizada</label>
                  <textarea 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Instruções para o cliente após o agendamento..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-blue-500 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Limite Diário (Opcional)</label>
                  <input 
                    type="number" 
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    placeholder="Ex: 10"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Confirmação de Agendamento</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setConfirmationType('auto')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${confirmationType === 'auto' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}
                    >
                      <CheckCircle2 size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Automática</span>
                    </button>
                    <button 
                      onClick={() => setConfirmationType('manual')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${confirmationType === 'manual' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}
                    >
                      <User size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Manual</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <Save size={20} />
              SALVAR CONFIGURAÇÕES
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-left duration-500">
            {/* Mini Painel de Controle */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-blue-100 dark:border-gray-800 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Confirmados</p>
                <p className="text-2xl font-black text-emerald-500">12</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-blue-100 dark:border-gray-800 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pendentes</p>
                <p className="text-2xl font-black text-amber-500">03</p>
              </div>
            </div>

            {/* Próximos Agendamentos */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Próximos Agendamentos
                </h3>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <History size={12} /> Histórico
                </button>
              </div>

              <div className="space-y-3">
                {appointments.map(apt => (
                  <div key={apt.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-blue-100 dark:border-gray-800 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">{apt.clientName}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                          {apt.serviceName} • {apt.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {apt.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                            className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                          >
                            <Check size={18} strokeWidth={3} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(apt.id, 'canceled')}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <X size={18} strokeWidth={3} />
                          </button>
                        </>
                      ) : (
                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${
                          apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {apt.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Banner Informativo */}
            <div className="p-6 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Dica Localizei</h4>
              <p className="text-xs font-medium text-blue-100 leading-relaxed">
                Mantenha sua agenda sempre atualizada para evitar cancelamentos e melhorar sua reputação no bairro.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};