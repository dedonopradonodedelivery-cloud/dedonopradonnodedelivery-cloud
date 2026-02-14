
import { MerchantJob } from "@/components/MerchantJobsModule";
import { CompatibilityResult } from "@/types";

// The candidate profile is a large JSON, I'll define a type for it here.
interface CandidateProfile {
  id: string;
  nome: string;
  localizacao?: { bairro?: string | null };
  disponibilidade?: { turnos?: string[] | null };
  habilidades_tecnicas?: string[] | null;
  habilidades_comportamentais?: string[] | null;
  experiencias?: { cargo?: string | null }[] | null;
  perfil_resumo?: string;
}

// Mock distances between neighborhoods
const neighborhoodDistances: Record<string, Record<string, number>> = {
  Freguesia: { Freguesia: 0, Taquara: 3, Anil: 2, Pechincha: 1, Tanque: 4, Curicica: 7 },
  Taquara: { Freguesia: 3, Taquara: 0, Anil: 5, Pechincha: 4, Tanque: 2, Curicica: 5 },
  Anil: { Freguesia: 2, Taquara: 5, Anil: 0, Pechincha: 3, Tanque: 6, Curicica: 8 },
  Pechincha: { Freguesia: 1, Taquara: 4, Anil: 3, Pechincha: 0, Tanque: 3, Curicica: 6 },
  Tanque: { Freguesia: 4, Taquara: 2, Anil: 6, Pechincha: 3, Tanque: 0, Curicica: 4 },
  Curicica: { Freguesia: 7, Taquara: 5, Anil: 8, Pechincha: 6, Tanque: 4, Curicica: 0 },
};

const getDistance = (from: string, to: string): number => {
  return neighborhoodDistances[from]?.[to] ?? 99; // Default to a high distance if not found
};

export const calculateCompatibility = (profile: CandidateProfile, job: MerchantJob): CompatibilityResult => {
  let score_total = 0;
  const motivos: string[] = [];
  const pontos_fortes: string[] = [];
  const pontos_de_atencao: string[] = [];

  // 1. Location Score (35%)
  const candidateNeighborhood = profile.localizacao?.bairro;
  if (candidateNeighborhood) {
    const distance = getDistance(candidateNeighborhood, job.bairro);
    const maxRadius = parseInt(job.raio_max_km.replace('km', ''));
    if (distance <= maxRadius) {
      score_total += 35;
      const reason = `Mora a ${distance}km da vaga (dentro do raio de ${maxRadius}km)`;
      motivos.push(reason);
      pontos_fortes.push(reason);
    } else {
      const reason = `Mora a ${distance}km da vaga (fora do raio de ${maxRadius}km)`;
      motivos.push(reason);
      pontos_de_atencao.push(reason);
    }
  } else {
    motivos.push("Bairro do candidato não informado");
    pontos_de_atencao.push("Não foi possível verificar a localização");
  }
  
  // 2. Availability Score (25%)
  const jobTurno = job.turno.toLowerCase();
  const candidateTurnos = profile.disponibilidade?.turnos?.map(t => t.toLowerCase()) || [];
  let turnoMatch = false;
  if (candidateTurnos.length > 0) {
      if (candidateTurnos.includes(jobTurno)) turnoMatch = true;
      else if (candidateTurnos.includes('integral') || candidateTurnos.includes('flexível') || candidateTurnos.includes('qualquer')) turnoMatch = true;
      else if (jobTurno === '12x36' && (candidateTurnos.includes('plantão') || candidateTurnos.includes('escala'))) turnoMatch = true;
  }
  if (turnoMatch) {
      score_total += 25;
      motivos.push("Disponibilidade de turno compatível");
      pontos_fortes.push("Turno compatível");
  } else {
      motivos.push("Disponibilidade de turno pode não ser compatível");
      pontos_de_atencao.push(`Turno da vaga (${job.turno}) não encontrado no perfil`);
  }

  // 3. Skills Score (25%)
  const requiredSkills = job.requisitos_obrigatorios.map(s => s.toLowerCase());
  const candidateSkills = [
    ...(profile.habilidades_tecnicas || []),
    ...(profile.habilidades_comportamentais || [])
  ].map(s => s.toLowerCase());
  
  if (requiredSkills.length > 0) {
    let matchedSkillsCount = 0;
    requiredSkills.forEach(reqSkill => {
      if (candidateSkills.some(candSkill => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))) {
        matchedSkillsCount++;
        pontos_fortes.push(`Possui habilidade: ${reqSkill}`);
      } else {
        pontos_de_atencao.push(`Não mencionou: ${reqSkill}`);
      }
    });
    const skillScore = (matchedSkillsCount / requiredSkills.length) * 25;
    score_total += skillScore;
    motivos.push(`Compatibilidade de ${matchedSkillsCount}/${requiredSkills.length} habilidades obrigatórias`);
  } else {
    score_total += 5; 
  }
  
  // 4. Experience Score (15%)
  const jobTitleKeywords = job.titulo_cargo.toLowerCase().split(' ');
  const jobExperienceReq = job.experiencia_minima?.toLowerCase();
  const candidateExperiences = profile.experiencias?.map(e => e.cargo?.toLowerCase() || '') || [];
  let experienceMatch = false;
  if(candidateExperiences.length > 0) {
      if(jobExperienceReq) {
          if (candidateExperiences.some(exp => exp.includes(jobExperienceReq))) {
              experienceMatch = true;
          }
      } else {
          if (candidateExperiences.some(exp => jobTitleKeywords.some(keyword => exp.includes(keyword)))) {
              experienceMatch = true;
          }
      }
  }
  if (experienceMatch) {
      score_total += 15;
      const reason = "Experiência profissional parece ser compatível";
      motivos.push(reason);
      pontos_fortes.push(reason);
  } else {
      motivos.push("Experiência profissional não compatível ou não informada");
      pontos_de_atencao.push("Não foi encontrada experiência relevante para a vaga");
  }

  return {
    score_total: Math.round(Math.min(score_total, 100)), // Cap at 100
    motivos,
    pontos_fortes,
    pontos_de_atencao,
  };
};


// --- FAKE DATA FOR TESTING ---

export const MOCK_CANDIDATE_PROFILES: CandidateProfile[] = [
    {
        id: 'cand-1', nome: 'Juliana Costa',
        localizacao: { bairro: 'Freguesia' },
        disponibilidade: { turnos: ['Tarde', 'Noite'] },
        habilidades_tecnicas: ['Operação de Caixa', 'Controle de Estoque', 'Vendas'],
        habilidades_comportamentais: ['Comunicação', 'Simpatia', 'Proatividade'],
        experiencias: [{ cargo: 'Atendente de Loja' }, { cargo: 'Operadora de Caixa' }],
        perfil_resumo: 'Profissional com 2 anos de experiência em atendimento ao cliente e varejo.'
    },
    {
        id: 'cand-2', nome: 'Marcos Oliveira',
        localizacao: { bairro: 'Pechincha' },
        disponibilidade: { turnos: ['Manhã', 'Tarde'] },
        habilidades_tecnicas: ['Cozinha Rápida', 'Higiene Alimentar'],
        habilidades_comportamentais: ['Trabalho em Equipe', 'Agilidade'],
        experiencias: [{ cargo: 'Auxiliar de Cozinha' }],
        perfil_resumo: 'Auxiliar de cozinha ágil e dedicado, com experiência em lanches e refeições rápidas.'
    },
    {
        id: 'cand-3', nome: 'Beatriz Lima',
        localizacao: { bairro: 'Curicica' },
        disponibilidade: { turnos: ['Integral'] },
        habilidades_tecnicas: ['Gestão de Cozinha', 'Preparo de Massas'],
        habilidades_comportamentais: ['Liderança', 'Organização'],
        experiencias: [{ cargo: 'Cozinheira' }, { cargo: 'Chefe de Cozinha' }],
        perfil_resumo: 'Cozinheira experiente com mais de 5 anos de atuação.'
    },
    {
        id: 'cand-4', nome: 'Carlos Souza',
        localizacao: { bairro: 'Taquara' },
        disponibilidade: { turnos: ['Integral'] },
        habilidades_tecnicas: ['Vendas', 'Negociação', 'CRM'],
        habilidades_comportamentais: ['Proativo', 'Comunicativo'],
        experiencias: [{ cargo: 'Vendedor' }, { cargo: 'Consultor de Vendas' }],
        perfil_resumo: 'Vendedor com foco em resultados e ótimo relacionamento com o cliente.'
    },
    {
        id: 'cand-5', nome: 'Fernanda Rocha',
        localizacao: { bairro: 'Anil' },
        disponibilidade: { turnos: ['Manhã'] },
        habilidades_tecnicas: ['Recepção', 'Agendamento', 'Pacote Office'],
        habilidades_comportamentais: ['Organização', 'Cordialidade'],
        experiencias: [{ cargo: 'Recepcionista' }],
        perfil_resumo: 'Recepcionista organizada e cordial, com experiência em clínicas.'
    },
    {
        id: 'cand-6', nome: 'Lucas Mendes',
        localizacao: { bairro: 'Tanque' },
        disponibilidade: { turnos: ['Integral'] },
        habilidades_tecnicas: ['Mecânica', 'Diagnóstico Veicular', 'Freios ABS'],
        habilidades_comportamentais: ['Atenção aos Detalhes'],
        experiencias: [{ cargo: 'Mecânico de Automóveis' }],
        perfil_resumo: 'Mecânico automotivo com 3 anos de experiência em oficinas.'
    },
    {
        id: 'cand-7', nome: 'Sofia Garcia',
        localizacao: { bairro: 'Freguesia' },
        disponibilidade: { turnos: ['Tarde'] },
        habilidades_tecnicas: ['Manicure', 'Pedicure', 'Unhas em Gel'],
        habilidades_comportamentais: ['Atendimento ao cliente'],
        experiencias: [{ cargo: 'Manicure' }],
        perfil_resumo: 'Manicure profissional com especialização em unhas de gel.'
    },
    {
        id: 'cand-8', nome: 'Gabriel Alves',
        localizacao: { bairro: 'Taquara' },
        disponibilidade: { turnos: ['Remoto'] },
        habilidades_tecnicas: ['Javascript', 'React', 'Node.js'],
        habilidades_comportamentais: ['Resolução de Problemas'],
        experiencias: [{ cargo: 'Desenvolvedor Web' }],
        perfil_resumo: 'Desenvolvedor focado em tecnologias web modernas.'
    },
    {
        id: 'cand-9', nome: 'Laura Martins',
        localizacao: { bairro: 'Pechincha' },
        disponibilidade: { turnos: ['Noite'] },
        habilidades_tecnicas: ['Atendimento ao Cliente'],
        habilidades_comportamentais: [],
        experiencias: [{ cargo: 'Estagiária' }],
        perfil_resumo: 'Estudante buscando primeira oportunidade de emprego.'
    },
    {
        id: 'cand-10', nome: 'Thiago Ribeiro',
        localizacao: { bairro: 'Freguesia' },
        disponibilidade: { turnos: ['Manhã'] },
        habilidades_tecnicas: ['Operação de Caixa', 'Atendimento'],
        habilidades_comportamentais: ['Pontualidade'],
        experiencias: [{ cargo: 'Atendente' }],
        perfil_resumo: 'Atendente com experiência em caixa e atendimento ao público.'
    }
];

export const MOCK_JOBS_FOR_TESTING: MerchantJob[] = [
    {
        id: 'job-1', titulo_cargo: 'Atendente de Balcão', empresa_nome: 'Padaria Imperial', bairro: 'Freguesia', raio_max_km: '3km', tipo: 'CLT', turno: 'Tarde', salario: 'R$ 1.850,00', requisitos_obrigatorios: ['Experiência com caixa', 'Simpatia'], habilidades_desejadas: ['Proatividade', 'Vendas'], descricao_curta: 'Atendimento ao cliente no balcão, caixa e organização.', status: 'ativa', experiencia_minima: 'Atendimento',
    },
    {
        id: 'job-2', titulo_cargo: 'Cozinheiro(a)', empresa_nome: 'Restaurante Sabor do Bairro', bairro: 'Freguesia', raio_max_km: '5km', tipo: 'CLT', turno: 'Manhã', salario: 'R$ 2.200,00', requisitos_obrigatorios: ['Experiência em cozinha', 'Higiene'], habilidades_desejadas: ['Agilidade'], descricao_curta: 'Preparo de pratos e organização da cozinha.', status: 'ativa', experiencia_minima: 'Cozinha',
    },
    {
        id: 'job-3', titulo_cargo: 'Vendedor(a) de Loja', empresa_nome: 'Boutique Chic', bairro: 'Taquara', raio_max_km: '5km', tipo: 'CLT', turno: 'Integral', salario: 'R$ 1.900 + Comissão', requisitos_obrigatorios: ['Vendas', 'Proatividade'], habilidades_desejadas: ['Moda'], descricao_curta: 'Venda de roupas femininas e organização da loja.', status: 'ativa', experiencia_minima: 'Vendas',
    },
    {
        id: 'job-4', titulo_cargo: 'Mecânico de Automóveis', empresa_nome: 'Oficina Veloz', bairro: 'Tanque', raio_max_km: '7km', tipo: 'PJ', turno: 'Integral', salario: 'A combinar', requisitos_obrigatorios: ['Mecânica', 'Diagnóstico'], habilidades_desejadas: ['CNH B'], descricao_curta: 'Manutenção e reparo de veículos leves.', status: 'ativa', experiencia_minima: 'Mecânico',
    },
    {
        id: 'job-5', titulo_cargo: 'Recepcionista', empresa_nome: 'Clínica Saúde & Bem-estar', bairro: 'Anil', raio_max_km: '3km', tipo: 'CLT', turno: 'Manhã', salario: 'R$ 1.700,00', requisitos_obrigatorios: ['Recepção', 'Agendamento', 'Pacote Office'], habilidades_desejadas: [], descricao_curta: 'Atendimento telefônico, agendamento e recepção de pacientes.', status: 'ativa', experiencia_minima: 'Recepção',
    },
    {
        id: 'job-6', titulo_cargo: 'Manicure/Pedicure', empresa_nome: 'Studio Unhas de Diva', bairro: 'Freguesia', raio_max_km: '2km', tipo: 'Freela', turno: 'Tarde', salario: 'Comissão', requisitos_obrigatorios: ['Manicure', 'Pedicure', 'Unhas em Gel'], habilidades_desejadas: [], descricao_curta: 'Serviços de manicure e pedicure, com foco em unhas de gel.', status: 'pausada', experiencia_minima: 'Estética',
    },
    {
        id: 'job-7', titulo_cargo: 'Auxiliar de Limpeza', empresa_nome: 'Condomínio Bosque', bairro: 'Curicica', raio_max_km: '5km', tipo: 'CLT', turno: 'Noite', salario: 'R$ 1.600,00', requisitos_obrigatorios: ['Limpeza', 'Organização'], habilidades_desejadas: [], descricao_curta: 'Limpeza e conservação das áreas comuns do condomínio.', status: 'ativa', experiencia_minima: 'Limpeza',
    },
    {
        id: 'job-8', titulo_cargo: 'Vendedor Externo', empresa_nome: 'JPA Telecom', bairro: 'Taquara', raio_max_km: '15km', tipo: 'PJ', turno: 'Integral', salario: 'Comissão', requisitos_obrigatorios: ['Vendas', 'CNH A'], habilidades_desejadas: ['Moto própria'], descricao_curta: 'Venda porta a porta de planos de internet.', status: 'ativa', experiencia_minima: 'Vendas',
    },
];

export const MOCK_APPLICATIONS_FOR_TESTING: Record<string, string[]> = {
    'job-1': ['cand-1', 'cand-2', 'cand-10'],
    'job-2': ['cand-2', 'cand-3'],
    'job-3': ['cand-4'],
    'job-4': ['cand-6'],
    'job-5': ['cand-5'],
    'job-6': ['cand-7'],
    'job-7': ['cand-9'],
    'job-8': ['cand-4', 'cand-8'],
};
