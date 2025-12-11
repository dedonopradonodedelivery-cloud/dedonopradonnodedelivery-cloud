
import React, { useState } from 'react';
import { X, Store, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MerchantLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantLeadModal: React.FC<MerchantLeadModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (!supabase) {
        // Fallback para ambiente de desenvolvimento sem Supabase configurado
        console.warn("Supabase client not found. Simulating success.");
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // INSERÇÃO DIRETA NA TABELA DE LEADS - SEM AUTH
        const { error } = await supabase.from('merchant_leads').insert({
          email,
          name: name || null,
          store_name: storeName || null,
          source: 'qr_code',
          created_at: new Date().toISOString()
        });

        if (error) throw error;
      }

      setIsSuccess(true);
      
      // Fechar automaticamente após alguns segundos
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (err: any) {
      console.error("Erro ao salvar lead:", err);
      setErrorMsg("Não conseguimos salvar seu contato agora. Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Resetar estados ao fechar
    setEmail('');
    setName('');
    setStoreName('');
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 flex flex-col items-center">
          
          {/* Header Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
            <Store className="w-8 h-8 text-white" />
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center text-center animate-in zoom-in duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sucesso!</h2>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xs leading-relaxed">
                Recebemos seu interesse. Nossa equipe de parcerias entrará em contato pelo e-mail <strong>{email}</strong> em breve.
              </p>
              <button 
                onClick={handleClose}
                className="mt-8 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
              >
                Fechar agora
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center font-display">
                Seja um Parceiro
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 max-w-[280px] leading-relaxed">
                Cadastre seus dados abaixo para receber nossa proposta comercial exclusiva para lojistas da Freguesia.
              </p>

              {errorMsg && (
                <div className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl mb-6 flex items-start gap-2 border border-red-100 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">
                    Seu E-mail (Obrigatório)
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="loja@exemplo.com"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">
                    Nome da Loja (Opcional)
                  </label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex: Padaria Imperial"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">
                    Seu Nome (Opcional)
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Quero saber mais
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
              
              <p className="mt-6 text-[10px] text-gray-400 text-center">
                Ao enviar, você concorda em receber o contato da nossa equipe comercial.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
