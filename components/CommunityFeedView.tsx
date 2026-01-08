
import React, { useState } from 'react';
import { Store, CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS, STORES } from '../constants';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal, 
  User as UserIcon, 
  Search, 
  ArrowLeft, 
  Send,
  MapPin,
  Store as StoreIcon,
  Video
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface CommunityFeedViewProps {
  onStoreClick: (store: Store) => void;
  user: User | null;
  onRequireLogin: () => void;
}

const MOCK_CHATS = [
  { id: 'c1', user: 'Ana Paula', avatar: 'https://i.pravatar.cc/100?u=a', lastMsg: 'Adorei a indicação da padaria!', time: '10:30', unread: true },
  { id: 'c2', user: 'Roberto Dias', avatar: 'https://i.pravatar.cc/100?u=r', lastMsg: 'Sabe se aceitam VR?', time: 'Ontem', unread: false },
];

const ChatScreen: React.FC<{ chatId: string; onBack: () => void; user: User | null }> = ({ chatId, onBack, user }) => {
    const chat = MOCK_CHATS.find(c => c.id === chatId);
    const [msg, setMsg] = useState('');
    
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 pb-20">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-10">
                <button onClick={onBack}><ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" /></button>
                <img src={chat?.avatar} className="w-8 h-8 rounded-full" alt={chat?.user} />
                <span className="font-bold text-gray-900 dark:text-white">{chat?.user}</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-gray-800 dark:text-gray-200">
                        {chat?.lastMsg}
                    </div>
                </div>
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <input 
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none dark:text-white"
                />
                <button className="p-2 bg-[#1E5BFF] rounded-full text-white"><Send className="w-4 h-4" /></button>
            </div>
        </div>
    );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'direct'>('feed');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const renderFeed = () => (
    <div className="pb-24 pt-2">
        {MOCK_COMMUNITY_POSTS.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 mb-2 py-4 px-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <img src={post.userAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700" alt={post.userName} />
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{post.userName}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                                {post.neighborhood && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {post.neighborhood} • </span>}
                                {post.timestamp}
                            </p>
                        </div>
                    </div>
                    <button className="text-gray-400"><MoreHorizontal className="w-5 h-5" /></button>
                </div>

                <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden mb-3">
                        <img src={post.imageUrl} className="w-full h-auto object-cover max-h-[400px]" alt="Post content" />
                    </div>
                )}
                
                {post.videoUrl && (
                    <div className="rounded-xl overflow-hidden mb-3 bg-black aspect-video flex items-center justify-center relative">
                        <Video className="w-12 h-12 text-white opacity-80" />
                        <span className="absolute bottom-2 right-2 text-[10px] text-white bg-black/50 px-2 py-1 rounded">Vídeo</span>
                    </div>
                )}

                {post.relatedStoreName && (
                    <div 
                        onClick={() => {
                            const store = STORES.find(s => s.id === post.relatedStoreId || s.name === post.relatedStoreName);
                            if (store) onStoreClick(store);
                        }}
                        className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mb-3 cursor-pointer"
                    >
                        <div className="p-1 bg-white dark:bg-gray-800 rounded-md">
                            <StoreIcon className="w-4 h-4 text-[#1E5BFF]" />
                        </div>
                        <span className="text-xs font-bold text-[#1E5BFF] dark:text-blue-300">{post.relatedStoreName}</span>
                    </div>
                )}

                <div className="flex items-center gap-6 pt-1">
                    <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-xs font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm hover:text-blue-500 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-xs font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm ml-auto hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        ))}
    </div>
  );

  const renderDirect = () => {
    if (!user) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Faça login</h3>
            <p className="text-sm text-gray-500 mb-6">Para ver suas mensagens, você precisa entrar na sua conta.</p>
            <button onClick={onRequireLogin} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full shadow-lg">Entrar</button>
        </div>
    );

    if (selectedChatId) return <ChatScreen chatId={selectedChatId} onBack={() => setSelectedChatId(null)} user={user} />;

    return (
        <div className="w-full bg-white dark:bg-gray-900 pb-24 min-h-screen">
            <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar conversa..." className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 transition-all dark:text-white" />
                </div>
            </div>
            <div className="px-4 py-3"><h3 className="font-bold text-gray-900 dark:text-white text-sm">Mensagens</h3></div>
            <div className="w-full flex-1">
                {MOCK_CHATS.map(chat => (
                    <div key={chat.id} onClick={() => setSelectedChatId(chat.id)} className="w-full flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors">
                        <div className="relative flex-shrink-0">
                            <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" alt={chat.user} />
                            {chat.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className={`text-sm truncate pr-2 text-gray-900 dark:text-white ${chat.unread ? 'font-bold' : 'font-medium'}`}>{chat.user}</h4>
                                <span className="text-[10px] whitespace-nowrap text-gray-400">{chat.time}</span>
                            </div>
                            <p className={`text-xs truncate ${chat.unread ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{chat.lastMsg}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800">
          <div className="flex pt-12 pb-0 px-4">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'feed' ? 'text-[#1E5BFF] border-[#1E5BFF]' : 'text-gray-400 border-transparent'}`}
              >
                Feed
              </button>
              <button 
                onClick={() => setActiveTab('direct')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'direct' ? 'text-[#1E5BFF] border-[#1E5BFF]' : 'text-gray-400 border-transparent'}`}
              >
                Mensagens
              </button>
          </div>
      </div>

      {activeTab === 'feed' ? renderFeed() : renderDirect()}
    </div>
  );
};
