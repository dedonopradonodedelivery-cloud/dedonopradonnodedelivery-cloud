
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ArrowLeft, 
  User, 
  Store, 
  Filter, 
  FileText,
  Phone,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'cliente' | 'lojista';
  created_at: string;
}

interface ContactsBaseViewProps {
  onBack: () => void;
}

// Mock Data para garantir visualização imediata caso o banco esteja vazio
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'João Silva', phone: '(21) 99999-1111', email: 'joao.silva@email.com', role: 'cliente', created_at: '2023-10-01' },
  { id: '2', name: 'Maria Oliveira', phone: '(21) 98888-2222', email: 'maria.o@email.com', role: 'cliente', created_at: '2023-10-05' },
  { id: '3', name: 'Hamburgueria Brasa', phone: '(21) 97777-3333', email: 'contato@brasa.com', role: 'lojista', created_at: '2023-09-15' },
  { id: '4', name: 'Padaria Imperial', phone: '(21) 96666-4444', email: 'adm@padariaimperial.com', role: 'lojista', created_at: '2023-09-10' },
  { id: '5', name: 'Carlos Pereira', phone: '(21) 95555-5555', email: 'carlos.p@email.com', role: 'cliente', created_at: '2023-11-01' },
];

export const ContactsBaseView: React.FC<ContactsBaseViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'cliente' | 'lojista'>('cliente');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'az' | 'newest'>('newest');
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email, role, created_at');

      if (!error && data && data.length > 0) {
        const formatted: Contact[] = data.map((item: any) => ({
          id: item.id,
          name: item.full_name || 'Sem nome',
          phone: item.phone || 'Sem telefone',
          email: item.email || 'Sem email',
          role: item.role === 'lojista' ? 'lojista' : 'cliente',
          created_at: item.created_at
        }));
        // Merge mock data for demo purposes if DB is sparse, or replace entirely
        // For this demo, we'll append DB data to Mock data
        setContacts([...MOCK_CONTACTS, ...formatted]);
      }
    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(c => c.role === activeTab);

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(lowerTerm) || 
        c.email.toLowerCase().includes(lowerTerm) ||
        c.phone.includes(searchTerm)
      );
    }

    if (sortOrder === 'az') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [contacts, activeTab, searchTerm, sortOrder]);

  const handleExport = (type: 'current' | 'all') => {
    let dataToExport = type === 'current' ? filteredContacts : contacts;
    
    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel compatibility
    csvContent += "Nome,WhatsApp,Email,Tipo,Data Cadastro\n";

    dataToExport.forEach(row => {
      const cleanPhone = row.phone.replace(/[^0-9]/g, ''); // Limpa formatação para CSV
      csvContent += `"${row.name}","${cleanPhone}","${row.email}","${row.role}","${row.created_at}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `localizei_base_${type === 'current' ? activeTab : 'completa'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans animate-in fade-in duration-500 flex flex-col">
      {/* Header */}
      <header className="bg-[#111827] border-b border-white/[0.04] px-6 py-4 sticky top-0 z-50 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 bg-[#1F2937] text-gray-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-lg uppercase tracking-tight text-white flex items-center gap-2">
              Base de Contatos
              <span className="bg-[#1E5BFF] text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">ADM</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">Gerenciamento de leads e usuários</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => handleExport('all')}
            className="flex items-center gap-2 bg-[#0B3A53] hover:bg-[#0B3A53]/80 text-[#38BDF8] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-[#38BDF8]/20 shadow-lg shadow-[#0B3A53]/50 active:scale-95"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Baixar Tudo</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
            
            {/* Tabs */}
            <div className="bg-[#1F2937] p-1 rounded-xl flex gap-1 border border-white/5">
                <button 
                    onClick={() => setActiveTab('cliente')}
                    className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeTab === 'cliente' 
                        ? 'bg-[#1E5BFF] text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <User size={14} />
                    Usuários
                </button>
                <button 
                    onClick={() => setActiveTab('lojista')}
                    className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeTab === 'lojista' 
                        ? 'bg-[#1E5BFF] text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Store size={14} />
                    Lojistas
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1F2937] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] placeholder-gray-600"
                    />
                </div>
                <button 
                    onClick={() => setSortOrder(prev => prev === 'az' ? 'newest' : 'az')}
                    className="bg-[#1F2937] text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-white/5 flex items-center gap-2 transition-colors active:scale-95"
                >
                    <Filter size={16} />
                    <span className="text-xs font-bold uppercase hidden sm:inline">
                        {sortOrder === 'az' ? 'A-Z' : 'Recentes'}
                    </span>
                </button>
            </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1F2937] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <User size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Usuários</p>
                    <p className="text-xl font-black text-white">{contacts.filter(c => c.role === 'cliente').length}</p>
                </div>
            </div>
            <div className="bg-[#1F2937] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Store size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Lojistas</p>
                    <p className="text-xl font-black text-white">{contacts.filter(c => c.role === 'lojista').length}</p>
                </div>
            </div>
            <div className="bg-[#1F2937] p-4 rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:bg-[#2D3748] transition-colors" onClick={() => handleExport('current')}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <FileText size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lista Atual</p>
                        <p className="text-sm font-bold text-white">Baixar CSV</p>
                    </div>
                </div>
                <Download size={16} className="text-gray-500" />
            </div>
        </div>

        {/* Table/List */}
        <div className="bg-[#1F2937] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#111827] text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                            <th className="p-4 font-bold">Nome</th>
                            <th className="p-4 font-bold">Contato</th>
                            <th className="p-4 font-bold">Email</th>
                            <th className="p-4 font-bold">Cadastro</th>
                            <th className="p-4 font-bold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredContacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-[#2D3748]/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                            contact.role === 'lojista' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {contact.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-sm text-gray-200">{contact.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Phone size={14} />
                                        {contact.phone}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Mail size={14} />
                                        {contact.email}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredContacts.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    <p className="text-sm">Nenhum contato encontrado.</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};
