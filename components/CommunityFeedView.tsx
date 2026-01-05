
import React, { useState, useEffect, useRef } from 'react';
import { Search, Store as StoreIcon, MoreHorizontal, Send, Heart, Share2, MessageCircle, ChevronLeft, BadgeCheck, User as UserIcon, Home, Plus, X, Video, Image as ImageIcon, Film, Loader2, Grid, Camera, Play, Check, ChevronRight, Briefcase, MapPin, Clock, DollarSign, ExternalLink, AlertCircle, Building2, Trash2, Flag } from 'lucide-react';
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

// --- MISSING COMPONENTS IMPLEMENTATION ---

const StoriesRail: React.FC<{
  user: any;
  onRequireLogin: () => void;
  onOpenStory: (index: number) => void;
}> = ({ user, onRequireLogin, onOpenStory }) => (
  <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar pb-2">
    {/* User's Add Story Button */}
    <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => user ? alert("Câmera de stories (Mock)") : onRequireLogin()}>
      <div className="w-[62px] h-[62px] rounded-full p-[2px] bg-gray-200 dark:bg-gray-800 relative">
         <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-black">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-3 text-gray-400" />}
         </div>
         <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-black text-white">
            <Plus className="w-3 h-3" />
         </div>
      </div>
      <span className="text-[10px] text-gray-600 dark:text-gray-300">Seu story</span>
    </div>

    {MOCK_STORIES.map((story, i) => (
      <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => onOpenStory(i)}>
        <div className={`w-[62px] h-[62px] rounded-full p-[2px] ${story.hasUnread ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
           <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-black">
              <img src={story.avatar} alt={story.user} className="w-full h-full object-cover" />
           </div>
        </div>
        <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate w-16 text-center">{story.user}</span>
      </div>
    ))}
  </div>
);

const StoryViewer: React.FC<{
  initialStoryIndex: number;
  onClose: () => void;
}> = ({ initialStoryIndex, onClose }) => {
   const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
   const story = MOCK_STORIES[currentIndex];

   return (
     <div className="fixed inset-0 z-[120] bg-black flex flex-col animate-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4 z-20">
           <button onClick={onClose}><X className="text-white w-8 h-8" /></button>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
           <img src={story.items[0].url} className="w-full h-full object-cover opacity-80" />
           <div className="absolute bottom-10 left-0 right-0 text-white text-center">
              <h3 className="font-bold text-lg">{story.user}</h3>
              <p className="text-sm">Story Mock</p>
           </div>
        </div>
     </div>
   );
};

const CommunityExploreScreen: React.FC = () => (
   <div className="p-1 grid grid-cols-3 gap-1 pb-20">
      {Array.from({length: 15}).map((_, i) => (
         <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 relative">
            <img src={`https://picsum.photos/300/300?random=${i}`} className="w-full h-full object-cover" />
         </div>
      ))}
   </div>
);

const UserProfileScreen: React.FC<{ user: any }> = ({ user }) => (
   <div className="pb-20">
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
         <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-3">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-4 text-gray-400" />}
         </div>
         <h2 className="font-bold text-lg text-gray-900 dark:text-white">{user?.user_metadata?.full_name || 'Usuário'}</h2>
         <p className="text-gray-500 text-sm">@{user?.user_metadata?.username || 'usuario'}</p>
         
         <div className="flex gap-8 mt-6">
            <div className="text-center">
               <div className="font-bold text-lg text-gray-900 dark:text-white">0</div>
               <div className="text-xs text-gray-500">Publicações</div>
            </div>
            <div className="text-center">
               <div className="font-bold text-lg text-gray-900 dark:text-white">0</div>
               <div className="text-xs text-gray-500">Seguidores</div>
            </div>
            <div className="text-center">
               <div className="font-bold text-lg text-gray-900 dark:text-white">0</div>
               <div className="text-xs text-gray-500">Seguindo</div>
            </div>
         </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800">
         <div className="p-10 text-center text-gray-400 text-sm">Ainda sem publicações</div>
      </div>
   </div>
);

const ChatScreen: React.FC<{
  chatId: number;
  onBack: () => void;
  user: any;
}> = ({ chatId, onBack, user }) => {
    const messages = MOCK_MESSAGES_HISTORY[chatId] || [];
    const [inputText, setInputText] = useState("");
    const [msgs, setMsgs] = useState(messages);

    const handleSend = () => {
        if(!inputText.trim()) return;
        setMsgs([...msgs, { id: Date.now(), text: inputText, sender: 'me', time: 'Agora' }]);
        setInputText("");
    };

    return (
        <div className="fixed inset-0 z-[110] bg-white dark:bg-gray-900 flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <button onClick={onBack}><ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" /></button>
                <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Chat</h3>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
                {msgs.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-sm shadow-sm'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <input 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none dark:text-white"
                    placeholder="Mensagem..."
                />
                <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-full"><Send className="w-4 h-4" /></button>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

// CREATE POST SCREEN (Replaces Modal)
const CreatePostScreen: React.FC<{ 
  onClose: () => void; 
  onSuccess: () => void;
  user: any; 
}> = ({ onClose, onSuccess, user }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Select Media, 2: Caption/Publish
  const [caption, setCaption] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: 'image' | 'video'; file?: File }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const newMedia: { url: string; type: 'image' | 'video'; file: File }[] = [];
      let videoCount = mediaFiles.filter(m => m.type === 'video').length;
      let imageCount = mediaFiles.filter(m => m.type === 'image').length;

      for (const file of files) {
        const isVideo = file.type.startsWith('video/');
        
        // Validation Rules
        if (isVideo) {
          if (videoCount > 0 || imageCount > 0) {
            alert("Vídeo deve ser postado sozinho.");
            continue;
          }
          // Mock duration check (would need async video element loading in real app)
          if (file.size > 50 * 1024 * 1024) { // 50MB Limit mock
             alert("Vídeo muito grande.");
             continue;
          }
          videoCount++;
        } else {
          if (videoCount > 0) {
             alert("Não é possível misturar foto e vídeo.");
             continue;
          }
          if (imageCount >= 4) {
             alert("Máximo de 4 fotos.");
             continue;
          }
          imageCount++;
        }

        newMedia.push({
          url: URL.createObjectURL(file),
          type: isVideo ? 'video' : 'image',
          file
        });
      }

      setMediaFiles(prev => [...prev, ...newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (mediaFiles.length === 0) {
        alert("Adicione uma foto ou vídeo (até 30s) para publicar.");
        return;
    }
    setStep(2);
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    // Simulate API
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 1500);
  };

  // HEADER FOR CREATE FLOW
  const CreateHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <button onClick={() => step === 1 ? onClose() : setStep(1)} className="p-2 -ml-2 text-gray-900 dark:text-white">
        {step === 1 ? <X className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>
      <h2 className="font-bold text-base text-gray-900 dark:text-white">
        {step === 1 ? 'Nova Publicação' : 'Nova Publicação'}
      </h2>
      <button 
        onClick={() => step === 1 ? handleNextStep() : handlePublish()}
        disabled={(step === 1 && mediaFiles.length === 0) || (step === 2 && isSubmitting)}
        className={`text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${
          (step === 1 && mediaFiles.length === 0) || isSubmitting
            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
            : 'text-[#1E5BFF] hover:bg-blue-50 dark:hover:bg-blue-900/20'
        }`}
      >
        {step === 1 ? 'Avançar' : isSubmitting ? 'Publicando...' : 'Compartilhar'}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-bottom duration-300">
      <CreateHeader />

      <div className="flex-1 overflow-y-auto">
        {step === 1 ? (
          // STEP 1: GALLERY SELECTOR
          <div className="flex flex-col h-full">
            {/* Preview Area (Large) */}
            <div className="w-full aspect-square bg-gray-100 dark:bg-black flex items-center justify-center relative overflow-hidden">
              {mediaFiles.length > 0 ? (
                mediaFiles[0].type === 'video' ? (
                  <video src={mediaFiles[0].url} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={mediaFiles[mediaFiles.length - 1].url} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-sm">Selecione uma mídia</span>
                </div>
              )}
            </div>

            {/* Selected Thumbnails Strip */}
            {mediaFiles.length > 0 && (
               <div className="flex gap-2 p-4 overflow-x-auto bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                  {mediaFiles.map((m, i) => (
                    <div key={i} className="w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden group">
                       {m.type === 'video' ? (
                         <video src={m.url} className="w-full h-full object-cover" />
                       ) : (
                         <img src={m.url} className="w-full h-full object-cover" />
                       )}
                       <button 
                         onClick={() => removeMedia(i)}
                         className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5"
                       >
                         <X className="w-3 h-3" />
                       </button>
                    </div>
                  ))}
               </div>
            )}

            {/* Gallery Grid Mock (Trigger Input) */}
            <div className="flex-1 p-1">
               <div className="flex justify-between items-center px-3 py-2">
                  <span className="font-bold text-sm dark:text-white">Galeria</span>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
                  >
                    <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    multiple 
                    accept="image/*,video/*" 
                    className="hidden" 
                    onChange={handleFileSelect}
                  />
               </div>
               
               {/* Mock Grid to look like gallery */}
               <div className="grid grid-cols-4 gap-0.5" onClick={() => fileInputRef.current?.click()}>
                  {Array.from({length: 12}).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity relative">
                        {/* Just visual placeholders */}
                        <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 dark:text-gray-600" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ) : (
          // STEP 2: CAPTION & DETAILS
          <div className="flex flex-col h-full">
             <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                   {mediaFiles[0].type === 'video' ? (
                     <video src={mediaFiles[0].url} className="w-full h-full object-cover" />
                   ) : (
                     <img src={mediaFiles[0].url} className="w-full h-full object-cover" />
                   )}
                </div>
                <div className="flex-1">
                   <textarea 
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Escreva uma legenda..."
                      className="w-full h-24 bg-transparent resize-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                      maxLength={2200}
                   />
                   <div className="text-right text-[10px] text-gray-400">
                      {caption.length}/2200
                   </div>
                </div>
             </div>
             
             {/* Mock Options */}
             <div className="p-4 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                   <span className="text-sm text-gray-900 dark:text-white">Adicionar localização</span>
                   <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                   <span className="text-sm text-gray-900 dark:text-white">Marcar pessoas</span>
                   <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ACTIVITY / NOTIFICATIONS SCREEN
const ActivityScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-10">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Atividades</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        <div className="px-4 py-3">
           <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4">Hoje</h3>
           <div className="space-y-5">
              {MOCK_NOTIFICATIONS.map((item) => (
                 <div key={item.id} className="flex items-center justify-between gap-3 group cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                       <div className="relative">
                          <img src={item.userAvatar} className="w-11 h-11 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                          {item.type === 'like' && <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5 border-2 border-white dark:border-gray-900"><Heart className="w-3 h-3 text-white fill-white" /></div>}
                          {item.type === 'comment' && <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-gray-900"><MessageCircle className="w-3 h-3 text-white fill-white" /></div>}
                          {item.type === 'mention' && <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-gray-900"><div className="w-3 h-3 text-white font-bold text-[8px] flex items-center justify-center">@</div></div>}
                       </div>
                       <div className="text-sm">
                          <span className="font-bold text-gray-900 dark:text-white mr-1">{item.user}</span>
                          <span className="text-gray-600 dark:text-gray-300">{item.content}</span>
                          <span className="text-gray-400 text-xs ml-1.5">{item.time}</span>
                       </div>
                    </div>
                    {item.type === 'follow' ? (
                       <button className="px-4 py-1.5 bg-[#1E5BFF] text-white text-xs font-bold rounded-lg active:scale-95 transition-transform">
                          Seguir
                       </button>
                    ) : item.postImage && (
                       <img src={item.postImage} className="w-11 h-11 rounded-lg object-cover" />
                    )}
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// DELETE CONFIRMATION MODAL
const DeleteConfirmationModal: React.FC<{ 
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 p-6">
        <div className="bg-white dark:bg-gray-800 w-full max-w-xs rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 text-center">Excluir esta postagem?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Essa ação não pode ser desfeita.</p>
            <div className="flex gap-3">
                <button 
                    onClick={onCancel}
                    className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl"
                >
                    Cancelar
                </button>
                <button 
                    onClick={onConfirm}
                    className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl"
                >
                    Excluir
                </button>
            </div>
        </div>
    </div>
  );
};

// JOB DETAIL / APPLICATION MODAL
const JobApplicationModal: React.FC<{ 
  job: Job; 
  onClose: () => void; 
  user: any;
  onRequireLogin: () => void;
}> = ({ job, onClose, user, onRequireLogin }) => {
  const handleApply = (method: 'whatsapp' | 'direct') => {
    if (!user) {
        onRequireLogin();
        return;
    }

    if (method === 'whatsapp') {
        const text = `Olá! Vi a vaga de *${job.role}* no app Localizei Freguesia e gostaria de me candidatar.`;
        const url = `https://wa.me/${job.contactWhatsapp}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        onClose();
    } else {
        // Direct flow mock
        alert(`Mensagem enviada para ${job.company} via Direct!`);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] p-6 pb-10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>

        <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {job.type}
                </span>
                <span className="text-xs text-gray-400 font-medium">{job.postedAt}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
                {job.role}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                <Building2 className="w-4 h-4" />
                {job.company}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Local</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.neighborhood}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Horário</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.schedule}</p>
            </div>
            {job.salary && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 col-span-2">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Salário / Remuneração</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.salary}</p>
                </div>
            )}
        </div>

        <div className="space-y-6 mb-8">
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Descrição</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {job.description}
                </p>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Requisitos</h3>
                <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            {req}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="space-y-3">
            <button 
                onClick={() => handleApply('whatsapp')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <MessageCircle className="w-5 h-5" />
                Candidatar-se via WhatsApp
            </button>
            <button 
                onClick={() => handleApply('direct')}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <Send className="w-4 h-4" />
                Enviar Direct
            </button>
        </div>
      </div>
    </div>
  );
};

// JOBS SCREEN
const JobsFeedScreen: React.FC<{ 
  user: any;
  onRequireLogin: () => void;
}> = ({ user, onRequireLogin }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const isMerchant = user?.user_metadata?.role === 'lojista';

  return (
    <div className="pb-20">
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    Vagas da Freguesia
                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Recentes</span>
                </h3>
            </div>

            <div className="space-y-4">
                {MOCK_JOBS.map((job) => (
                    <div 
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
                    >
                        {job.isUrgent && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-bl-xl uppercase tracking-wider">
                                Urgente
                            </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{job.role}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{job.company}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase rounded-md border border-gray-200 dark:border-gray-600">
                                {job.type}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase rounded-md border border-gray-200 dark:border-gray-600">
                                {job.neighborhood}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase rounded-md border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {job.postedAt}
                            </span>
                        </div>

                        <button className="w-full py-2.5 bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold text-sm rounded-xl transition-colors">
                            Candidatar-se
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Merchant FAB to post jobs */}
        {isMerchant && (
            <div className="fixed bottom-24 right-5 z-40">
                <button 
                    onClick={() => alert("Redirecionar para Painel do Lojista > Minhas Vagas")}
                    className="bg-black dark:bg-white text-white dark:text-black font-bold py-3 px-5 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                >
                    <Plus className="w-5 h-5" />
                    Anunciar Vaga
                </button>
            </div>
        )}

        {selectedJob && (
            <JobApplicationModal 
                job={selectedJob} 
                onClose={() => setSelectedJob(null)} 
                user={user}
                onRequireLogin={onRequireLogin}
            />
        )}
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
}> = ({ post, onLike, activeMenuId, setActiveMenuId, currentUserId, onDeleteRequest, onReport }) => {
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMenuOpen = activeMenuId === post.id;
  const isOwner = currentUserId === post.userId;

  const handleLike = () => {
    onLike();
    setLiked(!liked);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMenuOpen) {
        setActiveMenuId(null);
    } else {
        setActiveMenuId(post.id);
    }
  };

  const MAX_PREVIEW_LENGTH = 180;
  const shouldTruncate = post.content.length > MAX_PREVIEW_LENGTH;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 relative">
      
      {/* Invisible Overlay for Menu Click-Outside */}
      {isMenuOpen && (
        <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveMenuId(null)}
        ></div>
      )}

      <div className="flex items-center justify-between mb-3 relative z-0">
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
        
        {/* Context Menu Container */}
        <div className="relative">
            <button onClick={handleToggleMenu} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full active:bg-gray-100 dark:active:bg-gray-700 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    {isOwner ? (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                onDeleteRequest(post.id);
                            }}
                            className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Excluir
                        </button>
                    ) : (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                onReport();
                            }}
                            className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                        >
                            <Flag className="w-3.5 h-3.5" />
                            Denunciar
                        </button>
                    )}
                </div>
            )}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap inline">
            {shouldTruncate && !isExpanded 
                ? post.content.slice(0, MAX_PREVIEW_LENGTH).trim() + "... " 
                : post.content + " "
            }
        </p>
        {shouldTruncate && (
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                {isExpanded ? "ver menos" : "ver mais"}
            </button>
        )}
      </div>

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

// 3. Internal Navigation Bar
const CommunityNavBar: React.FC<{ 
  currentView: string; 
  onChangeView: (view: 'home' | 'direct' | 'explore' | 'profile' | 'jobs') => void;
  userAvatar?: string;
  hasUnreadMessages?: boolean;
}> = ({ currentView, onChangeView, userAvatar, hasUnreadMessages }) => (
  <div className="sticky top-[70px] z-20 flex justify-center mb-0 px-3 pointer-events-none w-full">
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-sm border border-gray-100 dark:border-gray-700 w-full flex items-center justify-between px-6 py-2.5 pointer-events-auto transition-all">
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
  
  // State for posts to handle optimistic delete
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  
  // Menu & Modal Logic
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleViewChange = (view: 'home' | 'direct' | 'explore' | 'profile' | 'jobs') => {
    if ((view === 'direct' || view === 'profile') && !user) {
      onRequireLogin();
      return;
    }
    setInternalView(view);
    
    // Reset specific states when leaving views
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

  // Triggered by "Excluir" in the context menu
  const handleRequestDelete = (postId: string) => {
    setPostToDelete(postId);
  };

  // Triggered by "Confirmar" in the confirmation modal
  const handleConfirmDelete = () => {
    if (postToDelete) {
        setPosts(prev => prev.filter(p => p.id !== postToDelete));
        setPostToDelete(null);
        setToastMessage('Post excluído');
        setShowSuccessToast(true); 
        setTimeout(() => setShowSuccessToast(false), 2000);
    }
  };

  // Triggered by "Denunciar" in the context menu
  const handleReport = () => {
    alert("Denúncia enviada com sucesso.");
  };

  const getHeaderTitle = () => {
    if (internalView === 'explore') return "Explorar a Freguesia";
    if (internalView === 'jobs') return "Vagas da Freguesia";
    return "Feed da Freguesia";
  };

  const renderContent = () => {
    switch (internalView) {
      case 'home':
        return (
          <div className="pb-20">
            <div className="pt-6">
              <StoriesRail 
                user={user} 
                onRequireLogin={onRequireLogin} 
                onOpenStory={(idx) => setViewingStoryIndex(idx)}
              />
            </div>

            <div className="p-5 pt-4">
              <div className="space-y-4">
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
                  />
                ))}
              </div>
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
          <div className="w-full min-h-screen bg-white dark:bg-gray-900 flex flex-col animate-in fade-in slide-in-from-right duration-300 pb-24">
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
      {/* Dynamic Header */}
      {(internalView === 'home' || internalView === 'jobs' || internalView === 'explore') && (
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4">
          <button 
            onClick={handleCreatePost}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          
          <h1 className="font-bold text-lg text-gray-900 dark:text-white font-display flex-1 text-center">
            {getHeaderTitle()}
          </h1>
          
          <button 
            onClick={handleNotifications}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <Heart className="w-6 h-6 text-gray-900 dark:text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
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
