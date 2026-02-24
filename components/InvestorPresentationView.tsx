
import React from 'react';
import { ArrowLeft, Presentation } from 'lucide-react';

interface InvestorPresentationViewProps {
  onBack: () => void;
}

export const InvestorPresentationView: React.FC<InvestorPresentationViewProps> = ({ onBack }) => {
  const sections = [
    'Visão Geral',
    'Problema',
    'Solução',
    'Produto',
    'Modelo de Negócio',
    'Tração',
    'Mercado',
    'Roadmap',
    'Equipe',
    'Pedido / Proposta'
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col animate-in fade-in duration-500">
      <header className="bg-[#0F172A] border-b border-white/10 px-6 py-6 sticky top-0 z-50 shadow-sm shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-black text-xl uppercase tracking-tighter text-white">
                Apresentação para Investidor
              </h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Localizei JPA</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <Presentation size={20} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto no-scrollbar pb-32 max-w-4xl mx-auto w-full space-y-12">
        {sections.map((section, index) => (
          <section key={index} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-indigo-500 font-black text-lg">0{index + 1}.</span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{section}</h2>
            </div>
            {section === 'Visão Geral' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>O Localizei JPA é um guia digital do bairro.</p>
                  <p>Ele conecta moradores e comerciantes locais dentro de uma única plataforma simples e intuitiva.</p>
                  <div>
                    <p>Funciona como uma mistura de:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>• Lista telefônica moderna</li>
                      <li>• Classificados locais</li>
                      <li>• Promoções e cupons</li>
                      <li>• Guia de serviços da região</li>
                    </ul>
                  </div>
                  <p>Tudo em um único aplicativo.</p>
                </div>
              </div>
            ) : section === 'Problema' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>Pequenos comércios enfrentam dificuldades para ganhar visibilidade.</p>
                  <div>
                    <p>Hoje dependem de:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>• Redes sociais</li>
                      <li>• Indicações</li>
                      <li>• Anúncios caros</li>
                    </ul>
                  </div>
                  <div>
                    <p>Enquanto isso, moradores:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>• Não sabem onde encontrar serviços locais</li>
                      <li>• Têm dificuldade em descobrir promoções</li>
                      <li>• Não possuem um canal centralizado do bairro</li>
                    </ul>
                  </div>
                  <p>Existe um desencontro entre quem vende e quem procura.</p>
                </div>
              </div>
            ) : section === 'Solução' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>O Localizei JPA cria um ponto de encontro digital da região.</p>
                  <div>
                    <p>Onde:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>• Comerciantes ganham visibilidade</li>
                      <li>• Moradores encontram tudo perto de casa</li>
                      <li>• Promoções circulam dentro do próprio bairro</li>
                    </ul>
                  </div>
                  <p>Um ecossistema local simples, direto e eficiente.</p>
                </div>
              </div>
            ) : section === 'Produto' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>O aplicativo permite:</p>
                  <ul className="mt-2 space-y-2 ml-2">
                    <li>✔ Buscar serviços locais</li>
                    <li>✔ Descobrir empresas próximas</li>
                    <li>✔ Visualizar promoções e cupons</li>
                    <li>✔ Explorar categorias do bairro</li>
                  </ul>
                  <p className="mt-4">Interface simples, intuitiva e acessível.</p>
                </div>
              </div>
            ) : section === 'Modelo de Negócio' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>Modelo escalável e estratégico:</p>
                  <p>O comerciante não paga para aparecer na plataforma.</p>
                  <div>
                    <p>Receitas atuais:</p>
                    <ul className="mt-2 space-y-2 ml-2">
                      <li>
                        <p>✔ Patrocinador Master Fundador</p>
                        <p className="ml-4">Investimento inicial: R$ 1.000,00</p>
                        <p className="ml-4">Após fase fundadora: R$ 2.500,00 / mês</p>
                      </li>
                      <li>
                        <p>✔ Banners por Especialidade</p>
                        <p className="ml-4">Valor: R$ 49,90</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p>Mais de 1.500 espaços publicitários disponíveis, considerando:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>• Especialidades</li>
                      <li>• Segmentação por bairro</li>
                      <li>• 9 bairros disponíveis</li>
                    </ul>
                  </div>
                  <div>
                    <p>Receitas futuras (V2):</p>
                    <ul className="mt-2 space-y-2 ml-2">
                      <li>
                        <p>✔ ADS Local</p>
                        <p className="ml-4">Investimento acessível: R$ 0,99 / dia</p>
                      </li>
                      <li>
                        <p>✔ JPA Connect (Networking Empresarial)</p>
                        <p className="ml-4">Mensalidade: R$ 200,00 por empresário</p>
                        <p className="ml-4">Grupos de 25 participantes</p>
                        <p className="ml-4">Capacidade inicial: até 10 grupos</p>
                      </li>
                      <li>
                        <p>✔ Lead de Serviços</p>
                        <p className="ml-4 mt-2">Moradores solicitam serviços no app e recebem até 5 orçamentos gratuitos.</p>
                        <p className="ml-4 mt-2">Profissionais pagam apenas para visualizar o lead:</p>
                        <p className="ml-4 mt-2">Valor: R$ 5,90 por lead</p>
                      </li>
                    </ul>
                  </div>
                  <p>Modelo baseado em múltiplas fontes de receita recorrente.</p>
                  <div>
                    <p>Plano de expansão:</p>
                    <p className="mt-2">Expansão prevista para bairros e regiões estratégicas:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Barra da Tijuca</li>
                      <li>✔ Recreio dos Bandeirantes</li>
                      <li>✔ Zona Sul</li>
                      <li>✔ Centro</li>
                      <li>✔ Méier</li>
                      <li>✔ Tijuca</li>
                      <li>✔ Ilha do Governador</li>
                      <li>✔ Duque de Caxias</li>
                      <li>✔ Nova Iguaçu</li>
                      <li>✔ São João de Meriti</li>
                      <li>✔ Belford Roxo</li>
                      <li>✔ Região Serrana</li>
                      <li>✔ Região dos Lagos</li>
                      <li>✔ Costa Verde</li>
                    </ul>
                  </div>
                  <p>Total previsto: 14 frentes de expansão</p>
                </div>
              </div>
            ) : section === 'Tração' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>Projeto em fase de expansão.</p>
                  <div>
                    <p>Já validamos:</p>
                    <ul className="mt-2 space-y-2 ml-2">
                      <li>✔ Interesse de comerciantes locais</li>
                      <li>✔ Aceitação da proposta</li>
                      <li>✔ Potencial de crescimento</li>
                    </ul>
                  </div>
                  <p className="mt-4">Agora buscamos aceleração estratégica.</p>
                </div>
              </div>
            ) : section === 'Mercado' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>Todo bairro possui:</p>
                  <ul className="mt-2 space-y-2 ml-2">
                    <li>✔ Comerciantes</li>
                    <li>✔ Prestadores de serviço</li>
                    <li>✔ Consumidores locais</li>
                  </ul>
                  <p className="mt-4">Modelo replicável e escalável.</p>
                </div>
              </div>
            ) : section === 'Roadmap' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>Próximos passos:</p>
                  <ul className="mt-2 space-y-2 ml-2">
                    <li>✔ Expansão de usuários</li>
                    <li>✔ Expansão de lojistas</li>
                    <li>✔ Fortalecimento da marca</li>
                    <li>✔ Escala para novas regiões</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-40 bg-slate-900/50 border border-dashed border-white/10 rounded-[2rem] flex items-center justify-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Espaço para conteúdo</p>
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};
