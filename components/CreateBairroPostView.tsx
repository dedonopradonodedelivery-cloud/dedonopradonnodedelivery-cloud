
import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  X, 
  Upload, 
  Send, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Newspaper,
  Calendar,
  Lock,
  Info
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Store, BairroPost } from '@/types';
import { FORBIDDEN_POST_WORDS } from '@/constants';
import { getStoreLogo } from '@/utils/mockLogos';

interface CreateBairroPostViewProps {
  onBack: () => void;
  user: User | null;
  stores: Store[]; // Para buscar o nome e logo da loja do user
}

export const CreateBairroPostView: React.FC<CreateBairroPostViewProps> = ({ onBack, user, stores }) => {
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null); // Base64 ou URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const merchantStore = user ? stores.find(s => s.owner_user_id === user.id) : null;
  const storeName = merchantStore?.name || user?.user_metadata?.store_name || "Sua Loja";
  const storeLogo = merchantStore?.logoUrl || getStoreLogo(storeName.length);

  // Simulação de limite de 1 post por dia (localStorage)
  const lastPostDateKey = `last_bairro_post_${user?.id}`;
  const lastPostDate = localStorage.getItem(lastPostDateKey);
  const canPostToday = !lastPostDate || new Date(lastPostDate).toDateString() !== new Date().toDateString();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPostImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validatePostContent = (content: string): boolean => {
    const lowerContent = content.toLowerCase();
    for (const word of FORBIDDEN_POST_WORDS) {
      if (lowerContent.includes(word)) {
        setError("Para divulgar descontos e promoções, utilize o bloco 'Cupons da Semana'.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !merchantStore) {
      setError("Você precisa ter uma loja registrada e logada para criar posts.");
      return;
    }
    if (!postContent.trim()) {
      setError("O conteúdo do post não pode estar vazio.");
      return;
    }
    if (!canPostToday) {
        setError("Você já fez uma postagem hoje. Tente novamente amanhã!");
        return;
    }
    if (!validatePostContent(postContent)) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulação de criação do post
    setTimeout(() => {
      const newPost: BairroPost = {
        id: `bp-${Date.now()}`,
        storeId: merchantStore.id,
        storeName: storeName,
        storeLogoUrl: storeLogo,
        imageUrl: postImage || undefined,
        content: postContent,
        createdAt: new Date().toISOString(),
      };

      // Adiciona o post ao mock (no mundo real seria salvo no Supabase)
      const currentPosts = JSON.parse(localStorage.getItem('MOCK_BAIRRO_POSTS') || '[]') as BairroPost[];
      localStorage.setItem('MOCK_BAIRRO_POSTS', JSON.stringify([newPost, ...currentPosts]));
      localStorage.setItem(lastPostDateKey, new Date().toISOString());

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => onBack(), 2000); // Volta para o painel após sucesso
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-20">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-purple-600" /> Criar Post
        </h1>
      </header>

      <main className="p-6">
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Post Publicado!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
              Sua novidade foi compartilhada com o bairro.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-start gap-4">
                <Info className="w-5 h-5 text-[#1E5BFF] shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                    Este espaço é para novidades e comunicados. Descontos e promoções devem ser cadastrados em <strong className="font-bold">Cupons da Semana</strong>.
                </p>
            </div>

            {!canPostToday && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800 flex items-start gap-4 animate-pulse">
                    <Calendar className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-amber-700 dark:text-amber-300 text-sm">Limite de Postagem Atingido</h3>
                        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed mt-1">
                            Você já fez uma postagem hoje. Volte amanhã para compartilhar mais novidades!
                        </p>
                    </div>
                </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Conteúdo do Post</label>
              <textarea 
                value={postContent}
                onChange={(e) => {
                  setPostContent(e.target.value);
                  validatePostContent(e.target.value); // Valida em tempo real
                }}
                placeholder="Compartilhe uma novidade, bastidores da sua loja ou um comunicado..."
                rows={5}
                className={`w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} outline-none focus:border-[#1E5BFF] transition-all dark:text-white resize-none`}
                disabled={!canPostToday || isSubmitting}
              />
              {error && (
                <div className="flex items-center gap-1.5 text-red-500 mt-2 ml-1">
                  <AlertTriangle size={14} />
                  <p className="text-[10px] font-bold">{error}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Foto (Opcional)</label>
              <div 
                onClick={() => !isSubmitting && canPostToday && imageInputRef.current?.click()}
                className={`w-full aspect-video rounded-2xl border-2 border-dashed ${!postImage ? 'border-gray-200 dark:border-gray-700' : 'border-[#1E5BFF]/30'} bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-3 transition-colors ${canPostToday && !isSubmitting ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-50'}`}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  hidden 
                  ref={imageInputRef} 
                  onChange={handleImageUpload} 
                  disabled={!canPostToday || isSubmitting}
                />
                {postImage ? (
                  <div className="relative w-full h-full p-2">
                    <img src={postImage} alt="Post preview" className="w-full h-full object-contain rounded-xl" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setPostImage(null); }}
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adicionar imagem</span>
                  </>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !canPostToday || !postContent.trim() || !!error}
              className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={16} />}
              Publicar no Bairro
            </button>
          </form>
        )}
      </main>
    </div>
  );
};
