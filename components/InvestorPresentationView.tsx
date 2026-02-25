
import React from 'react';
import { ArrowLeft, Presentation, Flame } from 'lucide-react';

interface InvestorPresentationViewProps {
  onBack: () => void;
}

const InvestmentItem: React.FC<{ title: string; items: string[]; subItems?: string[]; subTotal?: string }> = ({ title, items, subItems, subTotal }) => (
  <div>
    <p className="text-indigo-400 font-bold flex items-center gap-2">
      <Flame size={16} className="text-indigo-500" />
      {title}
    </p>
    <ul className="mt-2 space-y-1 ml-2">
      {items.map((item, index) => <li key={index}>✔ {item}</li>)}
    </ul>
    {subItems && (
      <div className="mt-2">
        <p>Incluindo:</p>
        <ul className="mt-2 space-y-1 ml-2">
          {subItems.map((item, index) => <li key={index}>✔ {item}</li>)}
        </ul>
      </div>
    )}
    {subTotal && <p className="mt-2 font-bold text-white">👉 {subTotal}</p>}
  </div>
);

const expansionPlan = [
    { zone: 'Zona Sudoeste', locations: ['Barra da Tijuca', 'Recreio dos Bandeirantes', 'Freguesia', 'Anil', 'Taquara', 'Pechincha', 'Vargem Grande', 'Vargem Pequena', 'Joá', 'Itanhangá', 'Camorim', 'Cidade de Deus', 'Gardênia Azul', 'Grumari', 'Rio das Pedras', 'Praça Seca', 'Tanque', 'Vila Valqueire'] },
    { zone: 'Zona Sul', locations: ['Leblon', 'Ipanema', 'Lagoa', 'Jardim Botânico', 'Gávea', 'Copacabana', 'Leme', 'Botafogo', 'Flamengo', 'Catete', 'Laranjeiras', 'Glória', 'Humaitá', 'Urca', 'São Conrado', 'Cosme Velho'] },
    { zone: 'Zona Norte', locations: ['Tijuca', 'Vila Isabel', 'Grajaú', 'Maracanã', 'Méier', 'Madureira', 'Penha', 'Ramos', 'Del Castilho', 'Cascadura', 'Rocha', 'São Cristóvão'] },
    { zone: 'Zona Oeste', locations: ['Campo Grande', 'Bangu', 'Realengo', 'Santa Cruz', 'Deodoro', 'Padre Miguel', 'Senador Camará', 'Paciência', 'Sepetiba'] },
    { zone: 'Centro (RJ)', locations: ['Centro', 'Lapa', 'Santa Teresa', 'Cidade Nova', 'Gamboa', 'Santo Cristo', 'Catumbi'] },
    { zone: 'Região Serrana', locations: ['Petrópolis', 'Teresópolis', 'Nova Friburgo', 'Guapimirim'] },
    { zone: 'Baixada Fluminense', locations: ['Duque de Caxias', 'Nova Iguaçu', 'São João de Meriti', 'Belford Roxo', 'Nilópolis', 'Mesquita', 'Queimados', 'Japeri', 'Seropédica', 'Magé', 'Itaguaí', 'Paracambi'] },
    { zone: 'Niterói', locations: ['Centro', 'Icaraí', 'Ingá', 'Boa Viagem', 'São Domingos', 'Gragoatá', 'Ponta d’Areia', 'Santa Rosa', 'Charitas', 'São Francisco'] },
    { zone: 'Região dos Lagos', locations: ['Cabo Frio', 'Arraial do Cabo', 'Armação dos Búzios', 'Araruama', 'São Pedro da Aldeia', 'Iguaba Grande', 'Saquarema'] },
    { zone: 'Costa Verde', locations: ['Angra dos Reis', 'Paraty', 'Mangaratiba', 'Itaguaí', 'Rio Claro'] }
];

const ExpansionRegion: React.FC<{ zone: string; locations: string[] }> = ({ zone, locations }) => (
    <div className="pb-6 border-b border-white/5 last:border-b-0 last:pb-0 mb-6 last:mb-0">
        <h3 className="text-base font-black text-indigo-400 mb-4 tracking-wider uppercase">{zone}</h3>
        <div className="columns-2 sm:columns-3 md:columns-4 gap-x-8">
            {locations.map((location, index) => (
                <p key={index} className="text-xs text-slate-400 mb-2 break-inside-avoid">{location}</p>
            ))}
        </div>
    </div>
);

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
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                <div className="text-slate-300 text-[15px] font-medium leading-relaxed space-y-8">
                  <p>
                    O <span className="text-white font-bold">Localizei JPA</span> é um guia digital do bairro.
                  </p>
                  <p>
                    Ele conecta <span className="text-white font-bold">moradores</span> e <span className="text-white font-bold">comerciantes locais</span> dentro de uma única plataforma simples e intuitiva.
                  </p>
                  <div className="space-y-4">
                    <p className="text-slate-400">Funciona como uma mistura de:</p>
                    <ul className="space-y-4 ml-2">
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Lista telefônica moderna</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Classificados locais</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Promoções e cupons</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Guia de serviços da região</li>
                    </ul>
                  </div>
                  <p className="text-white font-bold text-lg pt-4 border-t border-white/5">
                    Tudo em um único aplicativo.
                  </p>
                </div>
              </div>
            ) : section === 'Problema' ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                <div className="text-slate-300 text-[15px] font-medium leading-relaxed space-y-8">
                  <p className="text-white font-bold text-lg">
                    Pequenos comércios enfrentam dificuldades para ganhar visibilidade.
                  </p>
                  <div className="space-y-4">
                    <p className="text-slate-400">Hoje dependem de:</p>
                    <ul className="space-y-4 ml-2">
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span> Redes sociais</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span> Indicações</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span> Anúncios caros</li>
                    </ul>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-slate-400">Enquanto isso, moradores:</p>
                    <ul className="space-y-4 ml-2">
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span> Não sabem onde encontrar serviços locais</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span> Têm dificuldade em descobrir promoções</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span> Não possuem um canal centralizado do bairro</li>
                    </ul>
                  </div>
                  <p className="text-white font-bold text-lg pt-4 border-t border-white/5">
                    Existe um desencontro entre quem vende e quem procura.
                  </p>
                </div>
              </div>
            ) : section === 'Solução' ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                <div className="text-slate-300 text-[15px] font-medium leading-relaxed space-y-8">
                  <p className="text-white font-bold text-lg">
                    O Localizei JPA cria um ponto de encontro digital da região.
                  </p>
                  <div className="space-y-4">
                    <p className="text-slate-400">Onde:</p>
                    <ul className="space-y-4 ml-2">
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> <span className="text-white">Comerciantes</span> ganham visibilidade</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> <span className="text-white">Moradores</span> encontram tudo perto de casa</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> <span className="text-white">Promoções</span> circulam dentro do próprio bairro</li>
                    </ul>
                  </div>
                  <p className="text-white font-bold text-lg pt-4 border-t border-white/5">
                    Um ecossistema local simples, direto e eficiente.
                  </p>
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
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                <div className="text-slate-300 text-[15px] font-medium leading-relaxed space-y-8">
                  <ul className="space-y-6">
                    <li className="bg-white/5 p-5 rounded-xl border border-white/5">
                      <p className="text-white font-bold flex items-center gap-2 text-lg mb-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        ADS Local
                      </p>
                      <p className="ml-4 text-slate-400">Investimento acessível: <span className="text-white">R$ 0,99 / dia</span></p>
                    </li>
                    <li className="bg-white/5 p-5 rounded-xl border border-white/5">
                      <p className="text-white font-bold flex items-center gap-2 text-lg mb-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        JPA Connect <span className="text-sm font-normal text-slate-400">(Networking Empresarial)</span>
                      </p>
                      <div className="ml-4 space-y-2 text-slate-400">
                        <p>Mensalidade: <span className="text-white">R$ 200,00</span> por empresário</p>
                        <p>Grupos de <span className="text-white">25 participantes</span></p>
                        <p>Capacidade inicial: <span className="text-white">até 10 grupos</span></p>
                      </div>
                    </li>
                    <li className="bg-white/5 p-5 rounded-xl border border-white/5">
                      <p className="text-white font-bold flex items-center gap-2 text-lg mb-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Lead de Serviços
                      </p>
                      <p className="ml-4 text-slate-400">Valor: <span className="text-white">R$ 5,90</span> por lead</p>
                    </li>
                    <li className="bg-white/5 p-5 rounded-xl border border-white/5">
                      <p className="text-white font-bold flex items-center gap-2 text-lg mb-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Cashback entre Lojas
                      </p>
                      <p className="ml-4 text-slate-400">Sistema de benefícios e incentivo ao consumo local dentro do ecossistema.</p>
                    </li>
                  </ul>
                  <p className="text-white font-bold text-lg pt-4 border-t border-white/5 text-center">
                    Modelo voltado para fortalecimento da economia do bairro.
                  </p>
                </div>
              </div>
            ) : section === 'Plano de Expansão' ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                <div className="space-y-6">
                  {expansionPlan.map((region, index) => (
                    <ExpansionRegion key={index} zone={region.zone} locations={region.locations} />
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <p className="text-indigo-300 font-bold mb-2">Escala Potencial do Modelo</p>
                  <p className="text-sm text-indigo-200/70 mb-4">Considerando replicação em todas as regiões previstas:</p>
                  <p className="text-3xl font-black text-white">Superior a R$ 800.000,00 <span className="text-lg font-medium text-slate-400">/ mês</span></p>
                  <p className="mt-2 text-xs text-indigo-300/50 uppercase tracking-widest">(Cenário Estratégico)</p>
                </div>
              </div>
            ) : section === 'Plano de Investimento' ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8">
                <div className="text-slate-300 text-sm font-medium leading-relaxed space-y-6">
                  <p className="text-lg font-bold text-white">Estrutura Refinada do Uso do Investimento</p>
                    
                    <InvestmentItem 
                      title="1. Estrutura Técnica"
                      items={['Publicação Apple + Android → R$ 700', 'Base de Dados – Lista de Comércios Reais → R$ 2.000']}
                    />

                    <InvestmentItem 
                      title="2. Formalização & Regularização"
                      items={['Formalização & Regularização → R$ 3.000']}
                      subItems={['Abertura de empresa / CNPJ', 'Taxas e licenças', 'Registros necessários']}
                    />

                    <InvestmentItem 
                      title="3. Lançamento & Aquisição Inicial"
                      items={['Redes sociais locais → R$ 5.000', 'Influenciadores locais → R$ 2.000']}
                      subTotal="Subtotal → R$ 7.000"
                    />

                    <InvestmentItem 
                      title="4. Marketing & Crescimento"
                      items={['Agência Marketing Digital → R$ 4.000', 'Investimento em Anúncios Digitais → R$ 4.000']}
                      subItems={['Meta Ads → R$ 2.000', 'Google Ads → R$ 2.000']}
                      subTotal="Subtotal → R$ 8.000"
                    />

                    <InvestmentItem 
                      title="5. Expansão & Operação Comercial"
                      items={['Estruturação comercial & posicionamento profissional → R$ 16.000']}
                    />

                    <InvestmentItem 
                      title="6. Reserva Estratégica de Crescimento"
                      items={['Reserva Estratégica de Crescimento → R$ 18.000']}
                    />

                    <InvestmentItem 
                      title="7. Margem Estratégica de Segurança Operacional"
                      items={['Margem Estratégica de Segurança Operacional → R$ 10.000']}
                      subItems={['Ajustes técnicos / melhorias', 'Infraestrutura / contingências', 'Estabilidade operacional', 'Continuidade do crescimento']}
                    />

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
