
import React, { useState, useEffect, useRef } from 'react';
import { Search, Store as StoreIcon, MoreHorizontal, Send, Heart, Share2, MessageCircle, ChevronLeft, BadgeCheck, User as UserIcon, Home, Plus, X, Video } from 'lucide-react';
import { Store, CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../constants';

interface CommunityFeedViewProps {
  onStoreClick: (store: Store) => void;
  user: any;
  onRequireLogin: () => void;
}

// --- MOCK DATA ---

const MOCK_STORIES = [
  { 
    id: 1, 
    user: 'Padaria Imperial', 
    username: 'padariaimperial',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', 
    isMerchant: true, 
    hasUnread: true,
    items: [
      { id: 's1', type: 'image', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop', duration: 5000 },
      { id: 's2', type: 'image', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  },
  { 
    id: 2, 
    user: 'Ana Paula', 
    username: 'anapaula',
    avatar: 'https://i.pravatar.cc/150?u=a', 
    isMerchant: false, 
    hasUnread: true,
    items: [
      { id: 's3', type: 'image', url: 'https://images.unsplash.com/photo-1526488807855-3096a6a23732?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  },
  { 
    id: 3, 
    user: 'Burger Freguesia', 
    username: 'burgerfreguesia',
    avatar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop', 
    isMerchant: true, 
    hasUnread: false,
    items: [
      { id: 's4', type: 'image', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  },
  { 
    id: 4, 
    user: 'Carlos Silva', 
    username: 'carlos.silva',
    avatar: 'https://i.pravatar.cc/150?u=c', 
    isMerchant: false, 
    hasUnread: false,
    items: [
      { id: 's5', type: 'image', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  }
];

const MOCK_CHATS = [
  { id: 1, user: 'Padaria Imperial', username: 'padariaimperial', avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', lastMsg: 'Seu pedido saiu para entrega!', time: '10:30', unread: true, isMerchant: true },
  { id: 2, user: 'Suporte Localizei', username: 'suporte', avatar: 'https://ui-avatars.com/api/?name=Suporte&background=0D8ABC&color=fff', lastMsg: 'Como podemos ajudar?', time: 'Ontem', unread: false, isMerchant: false },
];

const MOCK_MESSAGES_HISTORY: Record<number, { id: number; text: string; sender: 'me' | 'them'; time: string }[]> = {
  1: [
    { id: 1, text: "Olá, bom dia! Têm pão de queijo quentinho?", sender: "me", time: "09:00" },
    { id: 2, text: "Bom dia! Sim, acabou de sair do forno 😋", sender: "them", time: "09:05" },
    { id: 3, text: "Ótimo! Vou querer 10 unidades para entrega.", sender: "me", time: "09:10" },
    { id: 4, text: "Perfeito. Já estamos preparando.", sender: "them", time: "09:15" },
    { id: 5, text: "Seu pedido saiu para entrega!", sender: "them", time: "10:30" },
  ],
  2: [
    { id: 1, text: "Olá, estou com dúvida sobre o cashback.", sender: "me", time: "Ontem" },
    { id: 2, text: "Olá! Claro, como podemos ajudar?", sender: "them", time: "Ontem" },
  ]
};

// --- SUB-COMPONENTS ---

const FeedPost: React.FC<{ post: CommunityPost; onLike: () => void }> = ({ post, onLike }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    onLike();
    setLiked(!liked);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
              {post.userName}
              {post.authorRole === 'merchant' && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white" />}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden">
          <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover" />
        </div>
      )}

      {post.videoUrl && (
        <div className="mb-3 rounded-xl overflow-hidden bg-black flex items-center justify-center h-48 relative">
           <Video className="w-12 h-12 text-white opacity-80" />
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-4">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </button>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const CommunityExploreScreen: React.FC = () => {
  return (
    <div className="p-5 pb-20">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar pessoas, lojas e posts..." 
          className="w-full bg-white dark:bg-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF] dark:text-white shadow-sm border border-gray-100 dark:border-gray-700"
        />
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Descobrir</h3>
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 text-white h-32 flex flex-col justify-end shadow-lg">
            <span className="font-bold">Eventos</span>
         </div>
         <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-4 text-white h-32 flex flex-col justify-end shadow-lg">
            <span className="font-bold">Promoções</span>
         </div>
         <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-4 text-white h-32 flex flex-col justify-end shadow-lg">
            <span className="font-bold">Notícias</span>
         </div>
         <div className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-4 text-white h-32 flex flex-col justify-end shadow-lg">
            <span className="font-bold">Dicas</span>
         </div>
      </div>
    </div>
  );
};

const UserProfileScreen: React.FC<{ user: any }> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="pb-20">
        <div className="bg-white dark:bg-gray-800 pb-6 rounded-b-[32px] shadow-sm border-b border-gray-100 dark:border-gray-700 pt-6 px-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg mb-4">
                {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserIcon className="w-10 h-10" />
                    </div>
                )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.user_metadata?.full_name || 'Usuário'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">@{user.user_metadata?.username || 'usuario'}</p>
            
            <div className="flex gap-6 mt-6 w-full max-w-xs justify-center">
                <div className="text-center">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">0</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Posts</span>
                </div>
                <div className="text-center">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">0</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Seguidores</span>
                </div>
                <div className="text-center">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">0</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Seguindo</span>
                </div>
            </div>
        </div>

        <div className="p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Minhas Atividades</h3>
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-400 text-sm">Você ainda não publicou nada.</p>
            </div>
        </div>
    </div>
  );
};

const ChatScreen: React.FC<{ 
  chatId: number; 
  onBack: () => void; 
  user: any;
}> = ({ chatId, onBack, user }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES_HISTORY[chatId] || []);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = {
        id: Date.now(),
        text: input,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate reply
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "Obrigado pela mensagem! Responderemos em breve.",
            sender: 'them',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, 1000);
  };

  const chatInfo = MOCK_CHATS.find(c => c.id === chatId);

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col w-full max-w-md mx-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 shadow-sm">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={chatInfo?.avatar} alt={chatInfo?.user} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                    {chatInfo?.user}
                    {chatInfo?.isMerchant && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-transparent" />}
                </h3>
                <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                        msg.sender === 'me' 
                        ? 'bg-[#1E5BFF] text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {msg.time}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-3"
            >
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escreva uma mensagem..."
                    className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 dark:text-white"
                />
                <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 bg-[#1E5BFF] rounded-full text-white shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none hover:bg-blue-600 transition-all active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    </div>
  );
};

// 1. Stories Rail
const StoriesRail: React.FC<{ 
  user: any; 
  onRequireLogin: () => void;
  onOpenStory: (index: number) => void;
}> = ({ user, onRequireLogin, onOpenStory }) => {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
      {/* My Story Button */}
      <button 
        onClick={() => user ? alert("Em breve: Postar Story") : onRequireLogin()}
        className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group"
      >
        <div className="relative w-[68px] h-[68px]">
          <div className="w-full h-full rounded-full p-[2px] bg-transparent border-2 border-gray-200 dark:border-gray-700">
             <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Me" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon className="w-8 h-8" />
                  </div>
                )}
             </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-[#1E5BFF] rounded-full p-1 border-2 border-white dark:border-gray-900">
            <Plus className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[70px]">Seu story</span>
      </button>

      {/* Stories List */}
      {MOCK_STORIES.map((story, index) => (
        <button 
          key={story.id} 
          onClick={() => onOpenStory(index)}
          className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group"
        >
          <div className={`w-[68px] h-[68px] rounded-full p-[2px] ${story.hasUnread ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-950 overflow-hidden relative">
              <img src={story.avatar} alt={story.user} className="w-full h-full object-cover group-active:scale-95 transition-transform" />
            </div>
          </div>
          <div className="flex items-center gap-1 max-w-[74px]">
            <span className={`text-xs ${story.hasUnread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'} truncate`}>
              {story.user}
            </span>
            {story.isMerchant && <BadgeCheck className="w-3 h-3 text-[#1E5BFF] fill-white dark:fill-gray-900 shrink-0" />}
          </div>
        </button>
      ))}
    </div>
  );
};

// 2. Full Screen Story Viewer
const StoryViewer: React.FC<{
  initialStoryIndex: number;
  onClose: () => void;
}> = ({ initialStoryIndex, onClose }) => {
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = MOCK_STORIES[currentStoryIdx];
  const currentItem = currentStory.items[currentItemIdx];

  // Auto-advance logic
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Update every 50ms
    const step = 100 / (currentItem.duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentItemIdx, currentStoryIdx, isPaused]);

  const handleNext = () => {
    if (currentItemIdx < currentStory.items.length - 1) {
      // Next item in same story
      setCurrentItemIdx(prev => prev + 1);
      setProgress(0);
    } else {
      // Next story
      if (currentStoryIdx < MOCK_STORIES.length - 1) {
        setCurrentStoryIdx(prev => prev + 1);
        setCurrentItemIdx(0);
        setProgress(0);
      } else {
        // End of all stories
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (currentItemIdx > 0) {
      setCurrentItemIdx(prev => prev - 1);
      setProgress(0);
    } else {
      if (currentStoryIdx > 0) {
        setCurrentStoryIdx(prev => prev - 1);
        setCurrentItemIdx(MOCK_STORIES[currentStoryIdx - 1].items.length - 1); // Last item of prev story
        setProgress(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-in fade-in duration-200">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-3">
        {currentStory.items.map((item, idx) => (
          <div key={item.id} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ 
                width: idx === currentItemIdx ? `${progress}%` : idx < currentItemIdx ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-5 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={currentStory.avatar} alt="" className="w-9 h-9 rounded-full border border-white/20" />
          <div className="flex flex-col">
             <div className="flex items-center gap-1">
                <span className="font-bold text-sm shadow-sm">{currentStory.user}</span>
                {currentStory.isMerchant && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white" />}
             </div>
             <span className="text-[10px] opacity-80">2h</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="p-1">
             <X className="w-6 h-6 drop-shadow-md" />
           </button>
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 relative flex items-center justify-center bg-gray-900"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
      >
        {currentItem.type === 'image' ? (
          <img src={currentItem.url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
             <Video className="w-12 h-12 text-gray-500" />
             {/* Use HTML5 Video here in production with autoPlay muted playsInline */}
          </div>
        )}

        {/* Tap Areas */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>
      </div>

      {/* Footer / Reply */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent pt-10">
         <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Enviar mensagem..." 
              className="flex-1 bg-transparent border border-white/40 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/70 focus:border-white outline-none backdrop-blur-sm"
            />
            <button className="p-2">
               <Heart className="w-7 h-7 text-white" />
            </button>
            <button className="p-2">
               <Send className="w-6 h-6 text-white rotate-[15deg]" />
            </button>
         </div>
      </div>
    </div>
  );
};

// 3. Internal Navigation Bar
const CommunityNavBar: React.FC<{ 
  currentView: string; 
  onChangeView: (view: 'home' | 'direct' | 'explore' | 'profile') => void;
  userAvatar?: string;
  hasUnreadMessages?: boolean;
}> = ({ currentView, onChangeView, userAvatar, hasUnreadMessages }) => (
  <div className="sticky top-[70px] z-20 flex justify-center mb-0 px-3 pointer-events-none w-full">
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-sm border border-gray-100 dark:border-gray-700 w-full flex items-center justify-between px-8 py-2.5 pointer-events-auto transition-all">
      <button 
        onClick={() => onChangeView('home')}
        className={`transition-colors ${currentView === 'home' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Home className={`w-6 h-6 ${currentView === 'home' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} />
      </button>

      <button 
        onClick={() => onChangeView('direct')}
        className={`transition-colors relative ${currentView === 'direct' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Send className={`w-6 h-6 ${currentView === 'direct' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} transform="rotate(-15)" />
        {hasUnreadMessages && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        )}
      </button>

      <button 
        onClick={() => onChangeView('explore')}
        className={`transition-colors ${currentView === 'explore' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Search className="w-6 h-6" strokeWidth={currentView === 'explore' ? 3 : 2} />
      </button>

      <button 
        onClick={() => onChangeView('profile')}
        className={`transition-all rounded-full overflow-hidden border-2 ${currentView === 'profile' ? 'border-black dark:border-white' : 'border-transparent'}`}
      >
        {userAvatar ? (
          <img src={userAvatar} alt="Profile" className="w-6 h-6 object-cover" />
        ) : (
          <UserIcon className={`w-6 h-6 ${currentView === 'profile' ? 'text-black dark:text-white fill-black dark:fill-white' : 'text-gray-400'}`} />
        )}
      </button>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  const [internalView, setInternalView] = useState<'home' | 'direct' | 'explore' | 'profile'>('home');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

  const handleViewChange = (view: 'home' | 'direct' | 'explore' | 'profile') => {
    if ((view === 'direct' || view === 'profile') && !user) {
      onRequireLogin();
      return;
    }
    setInternalView(view);
    
    // Reset specific states when leaving views
    if (view !== 'direct') setSelectedChatId(null);
  };

  const renderContent = () => {
    switch (internalView) {
      case 'home':
        return (
          <div className="pb-20">
            {/* Stories Rail */}
            <StoriesRail 
              user={user} 
              onRequireLogin={onRequireLogin} 
              onOpenStory={(idx) => setViewingStoryIndex(idx)}
            />

            {/* Posts Feed */}
            <div className="p-5 pt-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                   {user?.user_metadata?.avatar_url ? (
                     <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">?</div>
                   )}
                </div>
                <input 
                  type="text" 
                  placeholder="O que está acontecendo no bairro?" 
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
                  onClick={() => !user && onRequireLogin()}
                />
                <button 
                  className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                  onClick={() => !user && onRequireLogin()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {MOCK_COMMUNITY_POSTS.map(post => (
                  <FeedPost key={post.id} post={post} onLike={() => !user && onRequireLogin()} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'explore':
        return <CommunityExploreScreen />;

      case 'profile':
        return <UserProfileScreen user={user} />;

      case 'direct':
        if (!user) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Faça login para ver suas mensagens</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Conecte-se para conversar com lojistas e vizinhos.
                </p>
                <button 
                  onClick={onRequireLogin}
                  className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-transform"
                >
                  Entrar na conta
                </button>
            </div>
          );
        }

        if (selectedChatId) {
          return (
            <ChatScreen 
              chatId={selectedChatId} 
              onBack={() => setSelectedChatId(null)} 
              user={user}
            />
          );
        }

        return (
          <div className="w-full bg-white dark:bg-gray-900 flex flex-col animate-in fade-in slide-in-from-right duration-300 pb-20">
            <div className="px-5 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar conversa..."
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF] dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="px-5 py-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Mensagens</h3>
            </div>
            
            <div className="w-full">
              {MOCK_CHATS.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChatId(chat.id)}
                  className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors active:bg-gray-100 dark:active:bg-gray-800 border-b border-gray-50 dark:border-gray-800/50 last:border-0 w-full"
                >
                  <div className="relative flex-shrink-0">
                    <img src={chat.avatar} alt={chat.user} className="w-12 h-12 rounded-full object-cover bg-gray-200 border border-gray-100 dark:border-gray-700" />
                    {chat.unread && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-sm truncate pr-2 flex items-center gap-1 ${chat.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {chat.user}
                        {chat.isMerchant && <BadgeCheck className="w-3 h-3 text-[#1E5BFF] fill-blue-50 dark:fill-transparent" />}
                      </h4>
                      <span className={`text-[10px] whitespace-nowrap ${chat.unread ? 'font-bold text-[#1E5BFF]' : 'text-gray-400'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-xs truncate ${chat.unread ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {chat.lastMsg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300 relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white font-display">Feed da Freguesia</h1>
        {/* The old toggle is removed, replaced by the NavBar below */}
        <div className="w-8"></div> {/* Spacer for visual balance if needed */}
      </div>

      {/* Internal Navigation Bar */}
      <CommunityNavBar 
        currentView={internalView} 
        onChangeView={handleViewChange} 
        userAvatar={user?.user_metadata?.avatar_url}
        hasUnreadMessages={true} // Mock state
      />

      <div className="p-0 relative w-full">
        {renderContent()}
      </div>

      {/* Story Viewer Overlay */}
      {viewingStoryIndex !== null && (
        <StoryViewer 
          initialStoryIndex={viewingStoryIndex} 
          onClose={() => setViewingStoryIndex(null)} 
        />
      )}
    </div>
  );
};
