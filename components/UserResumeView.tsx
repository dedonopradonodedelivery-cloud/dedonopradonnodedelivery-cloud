
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, FileText, Upload, Loader2, BrainCircuit, CheckCircle2, AlertTriangle, Edit3, X, Save, MapPin, Briefcase, Clock, FileWarning } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenAI } from "@google/genai";

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';

interface UserResumeViewProps {
  user: User | null;
  onBack: () => void;
}

type ResumeStatus = 'idle' | 'reading' | 'analyzing' | 'success' | 'error';

interface ResumeProfile {
  targetRole: string | null;
  neighborhood: string | null;
  availability: string | null;
  skills: string[];
  summary: string | null;
  fileName: string;
  extractedText?: string;
  rawProfile?: any;
}

export const UserResumeView: React.FC<UserResumeViewProps> = ({ user, onBack }) => {
  const [status, setStatus] = useState<ResumeStatus>('idle');
  const [profile, setProfile] = useState<Partial<ResumeProfile> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editData, setEditData] = useState({ targetRole: '', neighborhood: '', availability: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storageKey = `user_resume_${user?.id}`;

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const data = JSON.parse(savedData);
      setProfile(data.profile);
      setStatus(data.status);
    }
  }, [storageKey]);

  const saveData = (newStatus: ResumeStatus, newProfile: Partial<ResumeProfile> | null) => {
    localStorage.setItem(storageKey, JSON.stringify({ status: newStatus, profile: newProfile }));
    setStatus(newStatus);
    setProfile(newProfile);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setStatus('reading');
    setErrorMessage('');
    setProfile({ fileName: file.name }); // Show filename while reading

    try {
      const arrayBuffer = await file.arrayBuffer();
      let extractedText = '';

      if (file.type === 'application/pdf') {
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          textContent += text.items.map((item: any) => item.str).join(' ');
        }
        if (textContent.trim().length < 100) { // Check for scanned PDF
          throw new Error('Este PDF parece uma imagem. Envie um DOCX ou um PDF com texto.');
        }
        extractedText = textContent;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else {
        throw new Error('Formato de arquivo não suportado. Use PDF ou DOCX.');
      }
      
      setStatus('analyzing');
      
      const prompt = `Você é um analisador de currículos. A partir do texto abaixo, extraia e retorne APENAS um JSON válido.

Regras:
- Se um campo não existir, use null ou [].
- Não invente informações.
- Normalize bairros/cidades se possível.
- Extraia habilidades técnicas com cuidado.
- Gere 'perfil_resumo' em 1-2 linhas.

JSON:
{
  "nome": null,
  "contato": {"email": null, "telefone": null},
  "localizacao": {"cidade": null, "bairro": null},
  "cargo_alvo": null,
  "perfil_resumo": null,
  "experiencias": [
    {"cargo": null, "empresa": null, "inicio": null, "fim": null, "atividades": []}
  ],
  "educacao": [],
  "habilidades_tecnicas": [],
  "habilidades_comportamentais": [],
  "disponibilidade": {"turnos": [], "dias": [], "inicio_imediato": null},
  "tipo_vaga_preferida": [],
  "pretensao_salarial": null,
  "palavras_chave": []
}

Texto do currículo:
<<<${extractedText}>>>`;
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const jsonText = response.text;
      if (!jsonText) {
          throw new Error("A IA retornou uma resposta vazia.");
      }
      
      const parsedProfile = JSON.parse(jsonText);

      const availabilityParts = [];
      if (parsedProfile.disponibilidade?.turnos?.length > 0) {
        availabilityParts.push(parsedProfile.disponibilidade.turnos.join('/'));
      }
      if (parsedProfile.disponibilidade?.dias?.length > 0) {
        availabilityParts.push(parsedProfile.disponibilidade.dias.join(', '));
      }
      const availabilityText = availabilityParts.join(' - ') || 'Não especificado';

      const newProfile: ResumeProfile = {
          fileName: file.name,
          targetRole: parsedProfile.cargo_alvo,
          neighborhood: [parsedProfile.localizacao?.bairro, parsedProfile.localizacao?.cidade].filter(Boolean).join(', '),
          availability: availabilityText,
          skills: parsedProfile.habilidades_tecnicas || [],
          summary: parsedProfile.perfil_resumo,
          extractedText,
          rawProfile: parsedProfile
      };

      saveData('success', newProfile);

    } catch (err: any) {
      let message = 'Ocorreu um erro ao processar o currículo.';
      if (err instanceof SyntaxError) {
          message = "A IA retornou um formato inválido. Tente novamente."
      } else if (err.message) {
          message = err.message;
      }
      setErrorMessage(message);
      saveData('error', { fileName: file.name });
    }
  };

  const handleStartEditing = () => {
    if (profile) {
      setEditData({
        targetRole: profile.targetRole || '',
        neighborhood: profile.neighborhood || '',
        availability: profile.availability || ''
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdits = () => {
    if (profile) {
      const updatedProfile = { ...profile, ...editData };
      saveData('success', updatedProfile as ResumeProfile);
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(storageKey);
    setStatus('idle');
    setProfile(null);
    setErrorMessage('');
  };

  const renderContent = () => {
    if (status === 'idle') {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-[#1E5BFF] mb-6 shadow-inner">
            <Upload size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Envie seu Currículo</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Nossa IA irá criar um perfil rápido para te conectar com as melhores vagas do bairro.</p>
          <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl">
            Selecionar Arquivo (PDF/DOCX)
          </button>
        </div>
      );
    }

    if (status === 'reading') {
      return (
        <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative w-24 h-24 mb-6">
            <Loader2 className="w-24 h-24 text-blue-200 dark:text-blue-800 animate-spin-slow" />
            <FileText className="absolute inset-0 m-auto w-10 h-10 text-[#1E5BFF]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lendo o arquivo...</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Extraindo texto do seu documento para análise.</p>
        </div>
      );
    }
    
    if (status === 'analyzing') {
      return (
        <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative w-24 h-24 mb-6">
            <Loader2 className="w-24 h-24 text-blue-200 dark:text-blue-800 animate-spin-slow" />
            <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-[#1E5BFF]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analisando seu currículo...</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">A IA está lendo seu documento para extrair as principais informações.</p>
        </div>
      );
    }
    
    if (status === 'error' && profile) {
      return (
         <div className="flex flex-col items-center text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-800/50">
           <FileWarning size={40} className="text-red-500 mb-4" />
           <h2 className="text-xl font-bold text-red-800 dark:text-red-300">Erro ao Processar</h2>
           <p className="text-sm text-red-600 dark:text-red-400 mt-2 mb-6">
             {errorMessage || `Não conseguimos ler o arquivo "${profile.fileName}". Tente novamente.`}
           </p>
           <button onClick={handleReset} className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl">
             Tentar Novamente
           </button>
         </div>
      );
    }

    if (status === 'success' && profile) {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Perfil Gerado com Sucesso</h2>
            </div>
            <button onClick={handleStartEditing} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
              <Edit3 size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Briefcase size={12}/> Cargo Alvo</label>
              <p className="font-bold text-gray-800 dark:text-white mt-1">{profile.targetRole}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><MapPin size={12}/> Bairro/Cidade</label>
                <p className="font-bold text-gray-800 dark:text-white mt-1">{profile.neighborhood}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Clock size={12}/> Disponibilidade</label>
                <p className="font-bold text-gray-800 dark:text-white mt-1">{profile.availability}</p>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumo Profissional</label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{profile.summary}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Habilidades Principais</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills?.map(skill => (
                  <span key={skill} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <button onClick={handleReset} className="w-full text-center text-red-500 text-xs font-bold uppercase tracking-widest">
              Substituir currículo
            </button>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500"><ChevronLeft size={20} /></button>
        <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Meu Currículo</h1>
      </header>

      <main className="flex-1 p-6">
        {renderContent()}
        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.doc" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
      </main>

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsEditing(false)}>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 dark:text-white">Editar Perfil Rápido</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500">Cargo Alvo</label>
                <input value={editData.targetRole} onChange={e => setEditData({...editData, targetRole: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mt-1 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Bairro/Cidade</label>
                <input value={editData.neighborhood} onChange={e => setEditData({...editData, neighborhood: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mt-1 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Disponibilidade</label>
                <input value={editData.availability} onChange={e => setEditData({...editData, availability: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mt-1 dark:text-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-bold">Cancelar</button>
              <button onClick={handleSaveEdits} className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
