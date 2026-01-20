import React, { useState } from 'react';
import { ChevronLeft, UploadCloud, CheckCircle2, File, Loader2 } from 'lucide-react';

interface BannerUploadViewProps {
  onBack: () => void;
}

export const BannerUploadView: React.FC<BannerUploadViewProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Enviar Banner</h1>
          <p className="text-xs text-slate-500">Última etapa para publicação</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {isSuccess ? (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border-2 border-green-500/20">
                <CheckCircle2 size={48} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
                Recebido!
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed mb-10">
                Seu banner foi enviado para análise. Ele estará ativo no app em até 24h úteis após a aprovação.
            </p>
            <button 
              onClick={onBack}
              className="w-full max-w-sm bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl shadow-lg border border-white/5 active:scale-[0.98] transition-all"
            >
                Voltar para o Painel
            </button>
          </div>
        ) : (
          <>
            <div className="w-full max-w-sm">
                <label 
                  htmlFor="banner-upload"
                  className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-slate-800/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#1E5BFF]/50 hover:bg-slate-800 transition-all group mb-8"
                >
                  <input id="banner-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                  
                  {file ? (
                    <div className="flex items-center gap-3 text-green-400">
                        <File size={24} />
                        <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                  ) : (
                    <>
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500 group-hover:text-[#1E5BFF] transition-colors">
                            <UploadCloud size={32} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Toque para selecionar a arte</span>
                    </>
                  )}
                </label>
                
                <div className="bg-slate-800 p-4 rounded-2xl text-left text-xs text-slate-400 space-y-2 border border-white/5 mb-8">
                    <p><strong>Formato:</strong> PNG, JPG ou WEBP</p>
                    <p><strong>Resolução Mínima:</strong> 800x600 pixels</p>
                    <p><strong>Tamanho Máximo:</strong> 5MB</p>
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enviar e Publicar'}
                </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};