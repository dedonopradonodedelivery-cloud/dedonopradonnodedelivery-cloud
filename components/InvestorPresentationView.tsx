
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
    'Modelo de Negócio',
    'Novas Receitas (V.2)',
    'Plano de Expansão',
    'Plano de Investimento',
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
            ) : section === 'Modelo de Negócio' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
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
                    <p>Estimativa de Faturamento (Cenário Conservador):</p>
                    <p className="mt-2">Considerando:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ 80% dos espaços de banners vendidos</li>
                      <li>✔ 1 Patrocinador Master ativo</li>
                    </ul>
                    <p className="mt-2">Modelo com potencial de geração de receita recorrente e previsível.</p>
                  </div>
                  <div>
                    <p>Faturamento Estimado (Cenário Conservador):</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Potencial superior a R$ 63.000,00 / mês</li>
                    </ul>
                    <p className="mt-2">Modelo baseado em receita recorrente e previsível.</p>
                  </div>
                </div>
              </div>
            ) : section === 'Novas Receitas (V.2)' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <ul className="mt-2 space-y-4 ml-2">
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
                      <p className="ml-4">Valor: R$ 5,90 por lead</p>
                    </li>
                    <li>
                      <p>✔ Cashback entre Lojas</p>
                      <p className="ml-4">Sistema de benefícios e incentivo ao consumo local dentro do ecossistema.</p>
                    </li>
                  </ul>
                  <p className="mt-4">Modelo voltado para fortalecimento da economia do bairro.</p>
                </div>
              </div>
            ) : section === 'Plano de Expansão' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>Modelo replicável e escalável.</p>
                  <div>
                    <p>Expansão prevista para bairros e regiões estratégicas:</p>
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

                  <div className="pt-4">
                    <p>Escala Potencial:</p>
                    <p className="mt-2">Mantendo apenas cenário conservador por região:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Expansão proporcional da base de receita</li>
                      <li>✔ Crescimento previsível e replicável</li>
                    </ul>
                    <p className="mt-2">Estrutura com alto potencial de valorização.</p>
                  </div>
                  <div className="pt-4">
                    <p>Escala Potencial do Modelo:</p>
                    <p className="mt-2">Considerando replicação em todas as regiões previstas:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Faturamento estimado superior a R$ 800.000,00 / mês (cenário estratégico)</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : section === 'Plano de Investimento' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-6">
                  <p className="text-lg font-bold text-white">Estrutura Refinada do Uso do Investimento</p>
                  
                  <div>
                    <p className="text-indigo-400 font-bold">🔥 1. Estrutura Técnica</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Publicação Apple + Android → R$ 700</li>
                      <li>✔ Base de Dados – Lista de Comércios Reais → R$ 2.000</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-indigo-400 font-bold">🔥 2. Formalização & Regularização</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Formalização & Regularização → R$ 3.000</li>
                    </ul>
                    <p className="mt-2">Incluindo:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Abertura de empresa / CNPJ</li>
                      <li>✔ Taxas e licenças</li>
                      <li>✔ Registros necessários</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-indigo-400 font-bold">🔥 3. Lançamento & Aquisição Inicial</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Redes sociais locais → R$ 5.000</li>
                      <li>✔ Influenciadores locais → R$ 2.000</li>
                    </ul>
                    <p className="mt-2 font-bold text-white">👉 Subtotal → R$ 7.000</p>
                  </div>

                  <div>
                    <p className="text-indigo-400 font-bold">🔥 4. Marketing & Crescimento</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Agência Marketing Digital → R$ 4.000</li>
                      <li>✔ Investimento em Anúncios Digitais → R$ 4.000</li>
                    </ul>
                    <p className="mt-2">Distribuição estratégica:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>• Meta Ads → R$ 2.000</li>
                      <li>• Google Ads → R$ 2.000</li>
                    </ul>
                    <p className="mt-2 font-bold text-white">👉 Subtotal → R$ 8.000</p>
                  </div>

                  <div>
                    <p className="text-indigo-400 font-bold">🔥 5. Expansão & Operação Comercial</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Estruturação comercial & posicionamento profissional → R$ 16.000</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-indigo-400 font-bold">🔥 6. Reserva Estratégica de Crescimento</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Reserva Estratégica de Crescimento → R$ 18.000</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-indigo-400 font-bold">🔥 7. Margem Estratégica de Segurança Operacional</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Margem Estratégica de Segurança Operacional → R$ 10.000</li>
                    </ul>
                    <p className="mt-2">Recursos destinados a:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ Ajustes técnicos / melhorias</li>
                      <li>✔ Infraestrutura / contingências</li>
                      <li>✔ Estabilidade operacional</li>
                      <li>✔ Continuidade do crescimento</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-lg font-bold text-white mb-4">✅ TOTAL ESTIMADO FINAL</p>
                    <ul className="space-y-2">
                      <li>Estrutura Técnica → R$ 2.700</li>
                      <li>Formalização → R$ 3.000</li>
                      <li>Lançamento → R$ 7.000</li>
                      <li>Marketing & Crescimento → R$ 8.000</li>
                      <li>Operação Comercial → R$ 16.000</li>
                      <li>Reserva Estratégica → R$ 18.000</li>
                      <li>Margem Segurança → R$ 10.000</li>
                    </ul>
                    <p className="mt-6 text-xl font-black text-indigo-400">💰 TOTAL → R$ 69.700</p>
                  </div>
                </div>
              </div>
            ) : section === 'Pedido / Proposta' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-4">
                  <p>Proposta de Parceria de Negócios: App Localizei JPA</p>
                  <div>
                    <p>1. Participação:</p>
                    <p>O investidor passa a ser dono de 30% da empresa</p>
                    <p className="mt-2">Garantia de Execução:</p>
                    <p>O protótipo já está funcionando (MVP), reduzindo o risco, pois o projeto já saiu do papel.</p>
                  </div>
                  <div>
                    <p>2. Como o investidor recebe os ganhos</p>
                    <p className="mt-2">Embora a participação societária seja de 30%, a divisão de lucros será:</p>
                    <p className="mt-2">Divisão Meio a Meio</p>
                    <p className="mt-2">De todo o lucro gerado pelo app:</p>
                    <ul className="mt-2 space-y-1 ml-2">
                      <li>✔ 50% para o investidor</li>
                      <li>✔ 50% para a operação</li>
                    </ul>
                    <p className="mt-2">Estrutura que permite recuperação acelerada do capital investido.</p>
                  </div>
                  <div>
                    <p>3. Gestão Profissional dos Resultados (Regra dos 4 Pilares)</p>
                    <p className="mt-2">Distribuição dos valores gerados:</p>
                    <ul className="mt-2 space-y-2 ml-2">
                      <li>
                        <p>✔ Crescimento (24%)</p>
                        <p className="ml-4">Fundo destinado a marketing, expansão e melhorias da plataforma.</p>
                      </li>
                      <li>
                        <p>✔ Trabalho (10%)</p>
                        <p className="ml-4">Pró-labore operacional.</p>
                      </li>
                      <li>
                        <p>✔ Lucro do Investidor (33%)</p>
                        <p className="ml-4">Retorno direto.</p>
                      </li>
                      <li>
                        <p>✔ Lucro Operacional (33%)</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p>5. Valor do Investimento</p>
                    <p className="mt-2">Valor: R$ 100.000,00</p>
                  </div>
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
