
import React, { useState, useEffect, useRef } from 'react';
import { Search, Store as StoreIcon, MoreHorizontal, Send, Heart, Share2, MessageCircle, ChevronLeft, BadgeCheck, User as UserIcon, Home, Plus, X, Video, Image as ImageIcon, Film, Loader2, Grid, Camera, Play, Check, ChevronRight, Briefcase, MapPin, Clock, DollarSign, ExternalLink, AlertCircle, Building2, Trash2, Flag, Bookmark } from 'lucide-react';
import { Store, CommunityPost, Job } from '../types';
import { MOCK_COMMUNITY_POSTS, MOCK_JOBS } from '../constants';

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

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'like', user: 'marcelo.rj', userAvatar: 'https://i.pravatar.cc/150?u=m', content: 'curtiu sua publicação.', time: '2 min', postImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100&auto=format&fit=crop', isUnread: true },
  { id: 2, type: 'follow', user: 'padariaimperial', userAvatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', content: 'começou a seguir você.', time: '1h', isUnread: true },
  { id: 3, type: 'comment', user: 'ana.paula', userAvatar: 'https://i.pravatar.cc/150?u=a', content: 'comentou: "Que delícia! Onde fica?"', time: '3h', postImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=100&auto=format&fit=crop', isUnread: false },
  { id: 4, type: 'mention', user: 'carlos.silva', userAvatar: 'https://i.pravatar.cc/150?u=c', content: 'mencionou você em um comentário.', time: '1d', postImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=100&auto=format&fit=crop', isUnread: false },
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

const StoryViewer: React.FC<{ initialStoryIndex: number; onClose: () => void }> = ({ initialStoryIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const story = MOCK_STORIES[currentIndex];
  
  useEffect(() => {
    if (!story) return;
    setProgress(0);
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                if (currentIndex < MOCK_STORIES.length - 1) {
                    setCurrentIndex(prevIndex => prevIndex + 1);
                    return 0;
                } else {
                    clearInterval(interval);
                    onClose();
                    return 100;
                }
            }
            return prev + 1; 
        });
    }, 50); 
    return () => clearInterval(interval);
  }, [currentIndex, story]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-8">
             <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                 <div className="h-full bg-white" style={{ width: `${progress}%` }} />
             </div>
        </div>
        <div className="absolute top-10 left-4 z-20 flex items-center gap-2">
            <img src={story.avatar} className="w-8 h-8 rounded-full border border-white" alt={story.user} />
            <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{story.username}</span>
        </div>
        <button onClick={onClose} className="absolute top-10 right-4 z-20 text-white"><X /></button>
        <div className="flex-1 bg-gray-900 flex items-center justify-center">
            {story.items && story.items[0] && (
                <img src={story.items[0].url} className="w-full h-full object-cover" alt="Story" />
            )}
        </div>
    </div>
  );
};

const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Excluir publicação?</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Essa ação é irreversível.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 py-3 font-bold text-white bg-red-500 rounded-xl">Excluir</button>
      </div>
    </div>
  </div>
);

const ChatScreen: React.FC<{ chatId: number; onBack: () => void; user: any }> = ({ chatId, onBack }) => {
    const messages = MOCK_MESSAGES_HISTORY[chatId] || [];
    const chatInfo = MOCK_CHATS.find(c => c.id === chatId);
    const [inputText, setInputText] = useState("");
    const [localMessages, setLocalMessages] = useState(messages);

    const handleSend = () => {
        if(!inputText.trim()) return;
        setLocalMessages([...localMessages, { id: Date.now(), text: inputText, sender: 'me', time: 'Agora' }]);
        setInputText("");
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <button onClick={onBack}><ChevronLeft className="w-6 h-6 dark:text-white" /></button>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={chatInfo?.avatar} className="w-full h-full object-cover" alt="Chat Avatar" />
                </div>
                <span className="font-bold text-sm dark:text-white">{chatInfo?.user}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {localMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-[#1E5BFF] text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-bl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <input 
                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none dark:text-white" 
                    placeholder="Mensagem..." 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                />
                <button onClick={handleSend} className="p-2 bg-[#1E5BFF] rounded-full text-white"><Send className="w-4 h-4" /></button>
            </div>
        </div>
    );
};

const CreatePostScreen: React.FC<{ onClose: () => void; onSuccess: () => void; user: any }> = ({ onClose, onSuccess, user }) => {
    const [text, setText] = useState("");
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <button onClick={onClose}><X className="w-6 h-6 dark:text-white" /></button>
                <h3 className="font-bold dark:text-white">Nova Publicação</h3>
                <button onClick={onSuccess} disabled={!text} className="text-[#1E5BFF] font-bold disabled:opacity-50">Publicar</button>
            </div>
            <div className="p-4 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="User" />}
                </div>
                <textarea 
                    autoFocus
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="O que está acontecendo na Freguesia?" 
                    className="flex-1 h-32 resize-none outline-none text-base dark:bg-gray-900 dark:text-white"
                />
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-6 text-[#1E5BFF]">
                <div className="flex flex-col items-center gap-1 cursor-pointer"><ImageIcon /><span className="text-xs">Foto</span></div>
                <div className="flex flex-col items-center gap-1 cursor-pointer"><Video /><span className="text-xs">Vídeo</span></div>
                <div className="flex flex-col items-center gap-1 cursor-pointer"><Camera /><span className="text-xs">Câmera</span></div>
            </div>
        </div>
    );
};

const ActivityScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="bg-white dark:bg-gray-900 min-h-full pb-20">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
            <button onClick={onClose}><ChevronLeft className="w-6 h-6 dark:text-white" /></button>
            <h2 className="font-bold text-lg dark:text-white">Atividade</h2>
        </div>
        <div className="p-2">
            {MOCK_NOTIFICATIONS.map(notif => (
                <div key={notif.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                        <img src={notif.userAvatar} className="w-full h-full object-cover" alt="User" />
                        {notif.type === 'like' && <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-0.5 border border-white"><Heart className="w-2 h-2 text-white fill-white" /></div>}
                        {notif.type === 'comment' && <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 border border-white"><MessageCircle className="w-2 h-2 text-white fill-white" /></div>}
                    </div>
                    <div className="flex-1 text-sm dark:text-gray-200">
                        <span className="font-bold mr-1">{notif.user}</span>
                        {notif.content}
                        <span className="text-xs text-gray-400 ml-2">{notif.time}</span>
                    </div>
                    {notif.postImage && <img src={notif.postImage} className="w-10 h-10 rounded-md object-cover" alt="Post" />}
                </div>
            ))}
        </div>
    </div>
);

const UserProfileScreen: React.FC<{ user: any }> = ({ user }) => (
    <div className="bg-white dark:bg-gray-900 min-h-full pb-20">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="font-bold text-lg dark:text-white">{user?.user_metadata?.username || user?.user_metadata?.full_name || 'Perfil'}</h2>
            <div className="flex gap-4">
                <div className="flex flex-col items-center"><span className="font-bold dark:text-white">0</span><span className="text-xs text-gray-500">Publicações</span></div>
                <div className="flex flex-col items-center"><span className="font-bold dark:text-white">124</span><span className="text-xs text-gray-500">Seguidores</span></div>
                <div className="flex flex-col items-center"><span className="font-bold dark:text-white">85</span><span className="text-xs text-gray-500">Seguindo</span></div>
            </div>
        </div>
        <div className="p-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-3">
                {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="User" />}
            </div>
            <h3 className="font-bold dark:text-white">{user?.user_metadata?.full_name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Morador da Freguesia • Amante de café</p>
            <button className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-sm dark:text-white">Editar Perfil</button>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-around p-2">
                <Grid className="w-6 h-6 text-gray-900 dark:text-white" />
                <Heart className="w-6 h-6 text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-0.5">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800"></div>
                ))}
            </div>
        </div>
    </div>
);

const JobsFeedScreen: React.FC<{ user: any; onRequireLogin: () => void }> = ({ user, onRequireLogin }) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full pb-20">
        <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-lg dark:text-white">Vagas na Freguesia</h2>
        </div>
        <div className="p-4 space-y-4">
            {MOCK_JOBS.map(job => (
                <div key={job.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{job.role}</h3>
                            <p className="text-sm text-gray-500">{job.company}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{job.type}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.neighborhood}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.postedAt}</span>
                    </div>
                    <button onClick={() => alert("Detalhes da vaga")} className="mt-3 w-full py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200">Ver detalhes</button>
                </div>
            ))}
        </div>
    </div>
);

const CommunityExploreScreen: React.FC = () => (
    <div className="bg-white dark:bg-gray-900 min-h-full pb-20">
        <div className="p-4">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input placeholder="Buscar no feed..." className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none dark:text-white" />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-0.5">
            {Array.from({length: 15}).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 relative group overflow-hidden">
                    <img src={`https://picsum.photos/300/300?random=${i}`} className="w-full h-full object-cover" alt="Random" />
                </div>
            ))}
        </div>
    </div>
);

const StoriesRail: React.FC<{
  user: any;
  onRequireLogin: () => void;
  onOpenStory: (index: number) => void;
}> = ({ user, onRequireLogin, onOpenStory }) => (
  <div className="flex gap-4 overflow-x-auto px-4 pt-5 pb-2 no-scrollbar bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
    {/* User's Add Story Button */}
    <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => user ? alert("Câmera de stories (Mock)") : onRequireLogin()}>
      <div className="w-[64px] h-[64px] rounded-full p-[2px] bg-white dark:bg-gray-900 relative">
         <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="User Story" /> : <UserIcon className="w-full h-full p-4 text-gray-300" />}
         </div>
         <div className="absolute bottom-0 right-0 bg-[#1E5BFF] rounded-full p-0.5 border-2 border-white dark:border-black text-white">
            <Plus className="w-3.5 h-3.5" />
         </div>
      </div>
      <span className="text-[11px] text-gray-900 dark:text-white font-medium">Seu story</span>
    </div>

    {MOCK_STORIES.map((story, i) => (
      <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => onOpenStory(i)}>
        <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${story.hasUnread ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
           <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-black">
              <img src={story.avatar} alt={story.user} className="w-full h-full object-cover" />
           </div>
        </div>
        <span className="text-[11px] text-gray-900 dark:text-white truncate w-16 text-center">{story.username}</span>
      </div>
    ))}
  </div>
);

const CommentsModal: React.FC<{ 
    postId: string;
    onClose: () => void;
    user: any;
}> = ({ postId, onClose, user }) => {
    const [comment, setComment] = useState("");
    const [mockComments, setMockComments] = useState([
        { id: 1, user: 'mariana.silva', text: 'Adorei! 😍', time: '5 min' },
        { id: 2, user: 'joao.pedro', text: 'Onde fica exatamente?', time: '12 min' },
    ]);

    const handlePost = () => {
        if (!comment.trim()) return;
        setMockComments([...mockComments, {
            id: Date.now(),
            user: user?.user_metadata?.username || 'voce',
            text: comment,
            time: 'Agora'
        }]);
        setComment("");
    };

    return (
        <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[70vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-800 relative">
                    <div className="w-10 h-1 bg-gray-300 rounded-full absolute top-2"></div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-2">Comentários</h3>
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-900 dark:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockComments.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                <img src={`https://ui-avatars.com/api/?name=${c.user}&background=random`} className="w-full h-full object-cover" alt="Commenter" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">
                                    <span className="font-bold mr-2">{c.user}</span>
                                    {c.text}
                                </p>
                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                    <span>{c.time}</span>
                                    <button className="font-bold">Responder</button>
                                </div>
                            </div>
                            <button className="self-start mt-1"><Heart className="w-3 h-3 text-gray-400" /></button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                         {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="User" /> : <UserIcon className="w-full h-full p-2 text-gray-400" />}
                    </div>
                    <input 
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Adicione um comentário..."
                        className="flex-1 text-sm outline-none bg-transparent dark:text-white"
                    />
                    <button 
                        onClick={handlePost}
                        disabled={!comment.trim()}
                        className="text-[#1E5BFF] font-bold text-sm disabled:opacity-50"
                    >
                        Publicar
                    </button>
                </div>
            </div>
        </div>
    );
};

const FeedPost: React.FC<{ 
    post: CommunityPost; 
    onLike: () => void; 
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    currentUserId?: string;
    onDeleteRequest: (postId: string) => void;
    onReport: () => void;
    onOpenComments: () => void;
}> = ({ post, onLike, activeMenuId, setActiveMenuId, currentUserId, onDeleteRequest, onReport, onOpenComments }) => {
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMenuOpen = activeMenuId === post.id;
  const isOwner = currentUserId === post.userId;

  const handleLike = () => {
    onLike();
    setLiked(!liked);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(isMenuOpen ? null : post.id);
  };

  const images = post.imageUrls && post.imageUrls.length > 0 
                 ? post.imageUrls 
                 : (post.imageUrl ? [post.imageUrl] : []);

  const MAX_CAPTION_LENGTH = 90;
  const shouldTruncate = post.content.length > MAX_CAPTION_LENGTH;

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2 last:border-0 relative">
      
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
             <div className="w-full h-full rounded-full border border-white dark:border-black overflow-hidden bg-gray-100">
                <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1 leading-none">
              {post.userUsername || post.userName.toLowerCase().replace(' ', '')}
              {post.authorRole === 'merchant' && <BadgeCheck className="w-3 h-3 text-[#1E5BFF] fill-white" />}
            </h4>
            {post.authorRole === 'merchant' && <span className="text-[10px] text-gray-500 dark:text-gray-400">Patrocinado</span>}
          </div>
        </div>
        
        <div className="relative">
            <button onClick={handleToggleMenu} className="text-gray-900 dark:text-white p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10 cursor-default" onClick={() => setActiveMenuId(null)}></div>
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {isOwner ? (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); onDeleteRequest(post.id); }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Excluir
                            </button>
                        ) : (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); onReport(); }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Denunciar
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
      </div>

      <div className={`w-full relative bg-gray-100 dark:bg-gray-800 overflow-hidden ${post.videoUrl ? 'aspect-[9/16]' : 'aspect-square'}`}>
         {post.videoUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <video src={post.videoUrl} controls className="w-full h-full object-cover" />
            </div>
         ) : images.length > 0 ? (
            <>
                <img 
                    src={images[currentImageIndex]} 
                    alt="Post content" 
                    className="w-full h-full object-cover" 
                />
                {images.length > 1 && (
                    <>
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm font-bold">
                            {currentImageIndex + 1}/{images.length}
                        </div>
                        {currentImageIndex > 0 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev - 1); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md text-gray-800"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        {currentImageIndex < images.length - 1 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev + 1); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md text-gray-800"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                            {images.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </>
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">Sem mídia</span>
            </div>
         )}
      </div>

      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="active:scale-90 transition-transform">
            <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-900 dark:text-white'}`} />
          </button>
          <button onClick={onOpenComments} className="active:scale-90 transition-transform">
            <MessageCircle className="w-6 h-6 text-gray-900 dark:text-white flip-horizontal" style={{ transform: 'scaleX(-1)' }} />
          </button>
          <button className="active:scale-90 transition-transform">
            <Send className="w-6 h-6 text-gray-900 dark:text-white -rotate-12" />
          </button>
        </div>
        <button className="active:scale-90 transition-transform">
            <Bookmark className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="font-bold text-sm text-gray-900 dark:text-white mb-1">
            {post.likes + (liked ? 1 : 0)} curtidas
        </div>

        <div className="text-sm text-gray-900 dark:text-white leading-tight">
            <span className="font-bold mr-2">{post.userUsername || post.userName.toLowerCase().replace(' ', '')}</span>
            <span className={shouldTruncate && !isExpanded ? "" : "whitespace-pre-wrap"}>
                {shouldTruncate && !isExpanded 
                    ? post.content.slice(0, MAX_CAPTION_LENGTH).trim() + "... " 
                    : post.content
                }
            </span>
            {shouldTruncate && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-500 dark:text-gray-400 text-sm ml-1"
                >
                    {isExpanded ? "" : "mais"}
                </button>
            )}
        </div>

        <button 
            onClick={onOpenComments}
            className="text-gray-500 dark:text-gray-400 text-sm mt-1"
        >
            Ver todos os {post.comments} comentários
        </button>
        
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase">
            {post.timestamp}
        </div>
      </div>
    </div>
  );
};

const CommunityNavBar: React.FC<{ 
  currentView: string; 
  onChangeView: (view: 'home' | 'direct' | 'explore' | 'profile' | 'jobs') => void;
  userAvatar?: string;
  hasUnreadMessages?: boolean;
}> = ({ currentView, onChangeView, userAvatar, hasUnreadMessages }) => (
  <div className="sticky top-[70px] z-20 flex justify-center mb-0 px-2 pointer-events-none w-full">
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-sm border border-gray-100 dark:border-gray-700 w-full flex items-center justify-between px-4 py-2.5 pointer-events-auto transition-all">
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

      <button 
        onClick={() => onChangeView('jobs')}
        className={`transition-colors ${currentView === 'jobs' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Briefcase className={`w-6 h-6 ${currentView === 'jobs' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} />
      </button>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  const [internalView, setInternalView] = useState<'home' | 'direct' | 'explore' | 'profile' | 'create_post' | 'notifications' | 'jobs'>('home');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  const handleViewChange = (view: 'home' | 'direct' | 'explore' | 'profile' | 'jobs') => {
    if ((view === 'direct' || view === 'profile') && !user) {
      onRequireLogin();
      return;
    }
    setInternalView(view);
    if (view !== 'direct') setSelectedChatId(null);
  };

  const handleCreatePost = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setInternalView('create_post');
  };

  const handleNotifications = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setInternalView('notifications');
  };

  const handlePostSuccess = () => {
    setInternalView('home');
    setToastMessage('Publicado com sucesso!');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestDelete = (postId: string) => {
    setPostToDelete(postId);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
        setPosts(prev => prev.filter(p => p.id !== postToDelete));
        setPostToDelete(null);
        setToastMessage('Post excluído');
        setShowSuccessToast(true); 
        setTimeout(() => setShowSuccessToast(false), 2000);
    }
  };

  const handleReport = () => {
    alert("Denúncia enviada com sucesso.");
  };

  const renderContent = () => {
    switch (internalView) {
      case 'home':
        return (
          <div className="pb-20">
            <StoriesRail 
              user={user} 
              onRequireLogin={onRequireLogin} 
              onOpenStory={(idx) => setViewingStoryIndex(idx)}
            />

            <div className="flex flex-col mt-2">
              {posts.map(post => (
                <FeedPost 
                  key={post.id} 
                  post={post} 
                  onLike={() => !user && onRequireLogin()} 
                  activeMenuId={activeMenuPostId} 
                  setActiveMenuId={setActiveMenuPostId}
                  currentUserId={user?.id}
                  onDeleteRequest={handleRequestDelete}
                  onReport={handleReport}
                  onOpenComments={() => user ? setCommentPostId(post.id) : onRequireLogin()}
                />
              ))}
            </div>
          </div>
        );

      case 'explore':
        return <CommunityExploreScreen />;

      case 'jobs':
        return <JobsFeedScreen user={user} onRequireLogin={onRequireLogin} />;

      case 'profile':
        return <UserProfileScreen user={user} />;

      case 'notifications':
        return <ActivityScreen onClose={() => setInternalView('home')} />;

      case 'create_post':
        return (
          <CreatePostScreen 
            onClose={() => setInternalView('home')} 
            onSuccess={handlePostSuccess} 
            user={user} 
          />
        );

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
          <div className="w-full bg-white dark:bg-gray-900 flex flex-col animate-in fade-in slide-in-from-right duration-300 pb-24 min-h-[calc(100vh-140px)]">
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar conversa..."
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF] dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="px-4 py-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Mensagens</h3>
            </div>
            
            <div className="w-full flex-1">
              {MOCK_CHATS.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChatId(chat.id)}
                  className="w-full flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors active:bg-gray-100 dark:active:bg-gray-800 border-b border-gray-50 dark:border-gray-800/50 last:border-0"
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
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300 relative">
      {/* Dynamic Header */}
      {(internalView === 'home' || internalView === 'jobs' || internalView === 'explore') && (
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md h-14 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4">
          <button 
            onClick={handleCreatePost}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white font-display flex-1 text-center">
              Feed – Localizei JPA
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
              Novidades dos bairros de Jacarepaguá
            </p>
          </div>
          
          <button 
            onClick={handleNotifications}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <Heart className="w-6 h-6 text-gray-900 dark:text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
          </button>
        </div>
      )}

      {/* Internal Navigation Bar */}
      {internalView !== 'create_post' && internalView !== 'notifications' && (
        <CommunityNavBar 
          currentView={internalView} 
          onChangeView={handleViewChange} 
          userAvatar={user?.user_metadata?.avatar_url}
          hasUnreadMessages={true} 
        />
      )}

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

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <DeleteConfirmationModal
            onConfirm={handleConfirmDelete}
            onCancel={() => setPostToDelete(null)}
        />
      )}

      {/* Comments Modal */}
      {commentPostId && (
        <CommentsModal 
            postId={commentPostId} 
            onClose={() => setCommentPostId(null)} 
            user={user} 
        />
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg z-[100] animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span className="text-sm font-bold">
             {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
};
