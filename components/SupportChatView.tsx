
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, User, Bot, CheckCircle2, MessageSquare, Loader2, Clock } from 'lucide-react';
import { SupportFAQ, SupportMessage, SupportTicket } from '../types';
import { supabase } from '../lib/supabaseClient';

const FAQ_DATA: SupportFAQ[] = [
  // USUÁRIOS
  { id: 'f1', profile: 'user', question: 'Onde vejo as promoções perto de mim?', answer: 'Na tela inicial, você encontra a seção "Novidades da Semana" e "Sugestões para você", que mostram as melhores ofertas baseadas na sua localização.' },
  { id: 'f2', profile: 'user', question: 'Preciso criar conta para usar o app?', answer: 'Você pode navegar e ver as lojas como visitante, mas para ganhar cashback, favoritar locais e usar o chat, precisa criar uma conta gratuita.' },
  { id: 'f3', profile: 'user', question: 'As ofertas são confiáveis?', answer: 'Sim! Verificamos manualmente os lojistas parceiros. Lojas com o selo azul "Verificado" possuem procedência garantida pela nossa equipe.' },
  { id: 'f4', profile: 'user', question: 'Como entro em contato com uma loja?', answer: 'Ao abrir a página de uma loja, você verá botões diretos para WhatsApp e Telefone, facilitando seu contato imediato.' },
  { id: 'f5', profile: 'user', question: 'O app é gratuito?', answer: 'Para moradores e usuários, o app é 100% gratuito. Você ainda economiza ganhando cashback em suas compras!' },
  // LOJISTAS
  { id: 'f6', profile: 'merchant', question: 'Como faço para anunciar no app?', answer: 'No seu painel de lojista, acesse "Anúncios de Banners". Lá você escolhe o plano (Home ou Categorias) e define a duração.' },
  { id: 'f7', profile: 'merchant', question: 'Quanto custa anunciar?', answer: 'Temos planos a partir de R$ 1,90/dia. O valor varia conforme a posição do banner e o tempo de exibição.' },
  { id: 'f8', profile: 'merchant', question: 'Não tenho arte, vocês criam o banner?', answer: 'Sim! Oferecemos um serviço de design profissional por um valor promocional. Nossa equipe cria a arte para você.' },
  { id: 'f9', profile: 'merchant', question: 'Em quanto tempo meu banner aparece?', answer: 'Após o pagamento e aprovação da arte, seu banner entra no ar em até 24 horas úteis.' },
  { id: 'f10', profile: 'merchant', question: 'Posso editar ou cancelar meu anúncio?', answer: 'Sim, você tem total autonomia para pausar anúncios ou solicitar alterações através deste chat de suporte.' },
];

interface SupportChatViewProps {
  user: any;
  onBack: () => void;
}

export const SupportChatView: React.FC<SupportChatViewProps> = ({ user, onBack }) => {
  const [step, setStep] = useState<'profile' | 'chat'>('profile');
  const [profileType, setProfileType] = useState<'user' | 'merchant' | null>(null);
  const [messages, setMessages] = useState<Partial<SupportMessage>[]>([
    { sender_type: 'bot', text: 'Olá! Sou o assistente do Localizei JPA. Para começar, você é um Usuário ou um Lojista?', created_at: new Date().toISOString() }
  ]);
  const [inputText, setInputText] = useState('');
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text: string, type: 'user' | 'bot' | 'admin') => {
    setMessages(prev => [...prev, { sender_type: type, text, created_at: new Date().toISOString() }]);
  };

  const selectProfile = (type: 'user' | 'merchant') => {
    setProfileType(type);
    setStep('chat');
    addMessage(type === 'user' ? 'Sou Usuário' : 'Sou Lojista', 'user');
    setTimeout(() => {
      addMessage('Entendido. Escolha uma das dúvidas frequentes ou descreva seu problema:', 'bot');
    }, 500);
  };

  const handleFaqClick = (faq: SupportFAQ) => {
    addMessage(faq.question, 'user');
    setTimeout(() => {
      addMessage(faq.answer, 'bot');
      setTimeout(() => {
        addMessage('Isso resolveu sua dúvida?', 'bot');
      }, 500);
    }, 500);
  };

  const startHumanSupport = async () => {
    setIsWaiting(true);
    addMessage('Não resolveu, preciso falar com um atendente.', 'user');
    
    // Criar Ticket no Supabase (Simulado se sem Supabase)
    const newTicket: SupportTicket = {
      id: `tk-${Date.now()}`,
      user_id: user?.id || 'anon',
      user_name: user?.user_metadata?.full_name || user?.email || 'Visitante',
      profile_type: profileType!,
      status: 'waiting',
      created_at: new Date().toISOString(),
      unread_count: 0
    };
    
    setTicket(newTicket);

    setTimeout(() => {
      addMessage('Você entrou na fila. Tempo estimado: até 10 minutos. Pode descrever seu caso enquanto aguarda.', 'bot');
    }, 800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addMessage(inputText, 'user');
    setInputText('');

    // Se estiver na fila, poderia enviar para o banco aqui
    console.log("Enviando para o suporte humano:", inputText);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 h-16 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-4 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white">Suporte Localizei</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online agora</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.sender_type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender_type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                {msg.sender_type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender_type === 'user' 
                ? 'bg-[#1E5BFF] text-white rounded-tr-none shadow-md shadow-blue-500/10' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {step === 'chat' && !isWaiting && messages[messages.length - 1]?.sender_type === 'bot' && !messages[messages.length - 1]?.text?.includes('resolveu') && (
          <div className="grid grid-cols-1 gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2">
            {FAQ_DATA.filter(f => f.profile === profileType).map(faq => (
              <button 
                key={faq.id}
                onClick={() => handleFaqClick(faq)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-xs font-bold text-left text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-colors"
              >
                {faq.question}
              </button>
            ))}
          </div>
        )}

        {messages[messages.length - 1]?.text?.includes('resolveu') && !isWaiting && (
          <div className="flex gap-2 mt-4 animate-in zoom-in duration-300">
            <button 
              onClick={() => addMessage('Sim, resolveu! Obrigado.', 'user')}
              className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl text-xs"
            >
              Sim, resolveu
            </button>
            <button 
              onClick={startHumanSupport}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl text-xs"
            >
              Falar com atendente
            </button>
          </div>
        )}
      </div>

      {/* Input / Quick Selection */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto">
        {step === 'profile' ? (
          <div className="flex gap-3">
            <button onClick={() => selectProfile('user')} className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 transition-all active:scale-95">
              <User className="text-blue-500" />
              <span className="text-xs font-bold dark:text-white">Usuário</span>
            </button>
            <button onClick={() => selectProfile('merchant')} className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 transition-all active:scale-95">
              <MessageSquare className="text-purple-500" />
              <span className="text-xs font-bold dark:text-white">Lojista</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isWaiting ? "Descreva seu problema..." : "Selecione uma opção acima"}
              disabled={!isWaiting}
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white disabled:opacity-50"
            />
            <button 
              disabled={!isWaiting || !inputText.trim()}
              className="w-12 h-12 bg-[#1E5BFF] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95 transition-transform"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
