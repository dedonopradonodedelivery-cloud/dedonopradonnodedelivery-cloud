
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MessageSquare, ThumbsUp, Store as StoreIcon, MoreHorizontal, Send, Heart, Share2, MessageCircle, ChevronLeft, BadgeCheck, User } from 'lucide-react';
import { Store, CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../constants';

interface CommunityFeedViewProps {
  onStoreClick: (store: Store) => void;
  user: any;
  onRequireLogin: () => void;
}

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

// Sub-component: Feed Post
const FeedPost: React.FC<{ post: CommunityPost; onLike: () => void }> = ({ post, onLike }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="relative">
            <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-100 dark:border-gray-700" />
            {post.authorRole === 'merchant' && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                    <StoreIcon className="w-2.5 h-2.5" />
                </div>
            )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{post.userName}</h4>
              {post.authorRole === 'merchant' && (
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                      Lojista
                  </span>
              )}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {post.userUsername && <span className="mr-1">@{post.userUsername}</span>}
              <span>• {post.timestamp}</span>
          </div>
        </div>
      </div>
      <button className="text-gray-400">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>

    <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
      {post.content}
    </p>

    {post.imageUrl && (
      <div className="w-full h-48 rounded-xl overflow-hidden mb-3 bg-gray-100">
        <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
      </div>
    )}

    {post.videoUrl && (
      <div className="w-full h-64 rounded-xl overflow-hidden mb-3 bg-black">
        <video src={post.videoUrl} controls className="w-full h-full object-cover" />
      </div>
    )}

    {post.relatedStoreName && (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex items-center gap-3 mb-3 cursor-pointer">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
          <StoreIcon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-blue-800 dark:text-blue-200">{post.relatedStoreName}</p>
          <p className="text-[10px] text-blue-600 dark:text-blue-300">Mencionado neste post</p>
        </div>
      </div>
    )}

    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
      <div className="flex gap-4">
        <button onClick={onLike} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-xs font-medium">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-medium">{post.comments}</span>
        </button>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Sub-component: Chat Screen
const ChatScreen: React.FC<{ 
  chatId: number; 
  onBack: () => void; 
  user: any;
}> = ({ chatId, onBack, user }) => {
  const chatInfo = MOCK_CHATS.find(c => c.id === chatId);
  const [messages, setMessages] = useState(MOCK_MESSAGES_HISTORY[chatId] || []);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'me' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  if (!chatInfo) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 absolute inset-0 z-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-sm shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-200" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
          <img src={chatInfo.avatar} alt={chatInfo.user} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{chatInfo.user}</h3>
            {chatInfo.isMerchant && (
              <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-transparent" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{chatInfo.username}</p>
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]/10 dark:bg-gray-900">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm relative group ${
                msg.sender === 'me' 
                  ? 'bg-[#1E5BFF] text-white rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite uma mensagem..." 
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] placeholder-gray-400 transition-all"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-[#1E5BFF] text-white rounded-full hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'messages'>('feed');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const handleTabChange = (tab: 'feed' | 'messages') => {
    if (tab === 'messages' && !user) {
      onRequireLogin();
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300 relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white font-display">Comunidade</h1>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button 
            onClick={() => handleTabChange('feed')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'feed' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Feed
          </button>
          <button 
            onClick={() => handleTabChange('messages')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'messages' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Mensagens
          </button>
        </div>
      </div>

      <div className="p-0 relative">
        {activeTab === 'feed' ? (
          <div className="p-5">
            {/* Create Post Input */}
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

            {/* Posts - Unified Feed (Residents & Merchants Mixed) */}
            <div className="space-y-4">
              {MOCK_COMMUNITY_POSTS.map(post => (
                <FeedPost key={post.id} post={post} onLike={() => !user && onRequireLogin()} />
              ))}
            </div>
          </div>
        ) : (
          /* Direct Messages View */
          <>
            {user ? (
              selectedChatId ? (
                <ChatScreen 
                  chatId={selectedChatId} 
                  onBack={() => setSelectedChatId(null)} 
                  user={user}
                />
              ) : (
                <div className="bg-white dark:bg-gray-900 min-h-[calc(100vh-64px)] flex flex-col animate-in fade-in slide-in-from-right duration-300">
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
                  
                  <div className="flex-1 overflow-y-auto pb-20">
                    {MOCK_CHATS.map(chat => (
                      <div 
                        key={chat.id} 
                        onClick={() => setSelectedChatId(chat.id)}
                        className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors active:bg-gray-100 dark:active:bg-gray-800 border-b border-gray-50 dark:border-gray-800/50 last:border-0"
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
              )
            ) : (
              // This case should ideally be handled by onRequireLogin, but as a fallback UI:
              <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-gray-400" />
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
            )}
          </>
        )}
      </div>
    </div>
  );
};
