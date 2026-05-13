export interface CrisisCard {
  id: string;
  title: string;
  description: string;
  onSuccess: number;
  onFailure: number;
}

export interface BenefitCard {
  id: string;
  title: string;
  description: string;
  effect: 'direto' | 'proxima' | 'escudo' | 'multiplicador';
  value: number;
}

export interface JokerQuestion {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const CRISES: CrisisCard[] = [
  { id: 'c1', title: 'Sistema de som falhou!', description: 'Abertura com 500 pessoas. Equipamento parou, fornecedor nao atende.', onSuccess: 150, onFailure: -80 },
  { id: 'c2', title: 'Fornecedor sumiu!', description: 'Alimentacao de 400 participantes em risco. Faltam 2h para o intervalo.', onSuccess: 150, onFailure: -70 },
  { id: 'c3', title: 'Tempestade tropical!', description: 'Chuva intensa cancela atividades ao ar livre. Faltam 4h de evento.', onSuccess: 150, onFailure: -80 },
  { id: 'c4', title: 'Acidente com participante!', description: 'Participante se machucou durante atividade. Atendimento imediato.', onSuccess: 200, onFailure: -100 },
  { id: 'c5', title: 'Patrocinador cancelou!', description: '30% do orcamento evaporou na vespera. Decisao financeira urgente.', onSuccess: 150, onFailure: -80 },
  { id: 'c6', title: 'Equipe adoeceu!', description: 'Metade da equipe ausente no dia do evento. Operacao em risco.', onSuccess: 150, onFailure: -70 },
  { id: 'c7', title: 'Local bloqueado!', description: 'Administracao negou acesso 24h antes. Busca emergencial necessaria.', onSuccess: 150, onFailure: -80 },
  { id: 'c8', title: 'Orcamento cortado 40%!', description: 'Cliente comunicou corte brutal na semana do evento ja anunciado.', onSuccess: 150, onFailure: -70 },
  { id: 'c9', title: 'Falha de comunicacao!', description: 'Equipes com versoes antigas do rundown. Operacao dessincronizada.', onSuccess: 150, onFailure: -60 },
  { id: 'c10', title: 'Superlotacao critica!', description: '1.200 pessoas em espaco para 500. Risco de seguranca iminente.', onSuccess: 200, onFailure: -100 },
  { id: 'c11', title: 'Material incompleto!', description: '60% dos itens nao chegaram. Atividades comecam em 1 hora.', onSuccess: 150, onFailure: -70 },
  { id: 'c12', title: 'Palestrante cancelou!', description: 'Atracao principal desistiu 1h antes. Publico ja esta presente.', onSuccess: 150, onFailure: -70 },
  { id: 'c13', title: 'Sistema travou!', description: 'Plataforma de inscricao offline. 200 participantes sem confirmacao.', onSuccess: 150, onFailure: -60 },
  { id: 'c14', title: 'Conflito na equipe!', description: 'Dois coordenadores em conflito sério paralisaram suas funcoes.', onSuccess: 150, onFailure: -80 },
  { id: 'c15', title: 'Calor extremo!', description: '43 graus registrados. Participantes com sinais de cansaco extremo.', onSuccess: 200, onFailure: -100 },
  { id: 'c16', title: 'Live caiu!', description: 'Transmissao travou com 1.500 espectadores. Evento hibrido comprometido.', onSuccess: 150, onFailure: -70 }
];

export const BENEFITS: BenefitCard[] = [
  { id: 'b1', title: 'Patrocinador surpresa!', description: 'Empresa aderiu como co-patrocinadora de ultima hora!', effect: 'direto', value: 200 },
  { id: 'b2', title: 'Equipe supermotivada!', description: 'Sua equipe entrou no modo turbo! Proxima questao vale DOBRO.', effect: 'proxima', value: 2 },
  { id: 'b3', title: 'Local premiado!', description: 'O espaco do evento foi eleito o melhor da cidade!', effect: 'direto', value: 150 },
  { id: 'b4', title: 'Midia espontanea!', description: 'Jornal de grande circulacao cobriu o evento gratuitamente!', effect: 'direto', value: 100 },
  { id: 'b5', title: 'Entrega antecipada!', description: 'Fornecedor entregou tudo antes do prazo. Proxima crise cancelada!', effect: 'escudo', value: 1 },
  { id: 'b6', title: 'Participacao recorde!', description: 'Publico superou em 200% a expectativa de participacao!', effect: 'direto', value: 200 },
  { id: 'b7', title: 'Feedback excelente!', description: 'Avaliacoes incriveis chegando de todos os participantes.', effect: 'direto', value: 150 },
  { id: 'b8', title: 'Sobrou verba!', description: 'Gestao financeira impecavel! Orcamento superavitario.', effect: 'direto', value: 100 },
  { id: 'b9', title: 'Seguro cobre tudo!', description: 'Apolice protege o evento. Proximas 2 respostas sem penalidade!', effect: 'escudo', value: 2 },
  { id: 'b10', title: 'Checklist perfeito!', description: 'Zero itens esquecidos. Executado com absoluta maestria!', effect: 'direto', value: 150 },
  { id: 'b11', title: 'Rundown impecavel!', description: 'Roteiro do evento executado no tempo certo, a risca!', effect: 'direto', value: 100 },
  { id: 'b12', title: 'Relatorio premiado!', description: 'Seu relatorio pos-evento foi o melhor da empresa neste ciclo!', effect: 'direto', value: 200 },
  { id: 'b13', title: 'Cliente encantado!', description: 'Fidelizou o cliente! XP total multiplicado por 1,15.', effect: 'multiplicador', value: 1.15 },
  { id: 'b14', title: 'Clima perfeito!', description: 'Sol brilhando exatamente como previsto no planejamento.', effect: 'direto', value: 100 },
  { id: 'b15', title: 'Parceria estrategica!', description: 'Empresa referencia firmou parceria com sua organizacao!', effect: 'direto', value: 150 },
  { id: 'b16', title: '5 estrelas no Google!', description: 'Avaliacao maxima! Reputacao profissional nas alturas.', effect: 'direto', value: 200 }
];

export const JOKERS: JokerQuestion[] = [
  {
    id: 'j1',
    title: 'Gestao simultanea de crises',
    scenario: 'Um bacharel em EF coordena uma olimpiada empresarial com 3.500 participantes. Durante o trans evento, o sistema de som falha e o fornecedor nao atende. Simultaneamente, dois voluntarios entram em conflito no posto central, travando as operacoes de comunicacao.',
    question: 'Qual sequencia de decisoes representa a MELHOR gestao simultanea da situacao?',
    options: [
      'Acionar plano de contingencia de audio, mediar o conflito e comunicar ao cliente — tudo em paralelo, mantendo visao global',
      'Cancelar a atividade atual, resolver o conflito e so entao acionar o plano de contingencia',
      'Delegar tudo a equipe sem intervencao direta, mantendo visao macro do evento',
      'Priorizar o conflito entre voluntarios e so depois acionar o plano de audio',
      'Comunicar os participantes sobre a falha de som e encerrar a atividade imediatamente'
    ],
    correctAnswer: 0,
    explanation: 'Gestao de crises simultâneas exige acao paralela, plano de contingencia ativo e comunicacao ao cliente sem paralisar o evento.'
  },
  {
    id: 'j2',
    title: 'Orcamento em colapso',
    scenario: 'A 72h do evento com 1.200 inscritos, o patrocinador principal (45% do budget) cancela contrato alegando forca maior. O pré-evento esta 90% concluido. Locacao, buffet e atracao principal ja foram contratados e ha multas rescisórias.',
    question: 'Qual e a decisao gerencial mais adequada segundo os principios de Fayol e gestao de eventos?',
    options: [
      'Cancelar o evento e reembolsar todos os participantes, evitando mais prejuizos',
      'Revisar o orcamento priorizando itens essenciais de seguranca e experiencia, acionar patrocinadores de emergencia e comunicar formalmente a diretoria',
      'Manter o evento sem alteracoes, assumindo o deficit e buscando compensacao juridica posterior',
      'Reduzir igualmente todos os contratos em 45% para equilibrar o orcamento',
      'Adiar o evento por 30 dias para captar novo patrocinador'
    ],
    correctAnswer: 1,
    explanation: 'A funcao Controlar de Fayol exige replanejamento imediato com priorizacao, nao cancelamento nem manutencao irresponsavel do status quo.'
  },
  {
    id: 'j3',
    title: 'Superlotacao e risco juridico',
    scenario: 'Evento de lazer para 800 pessoas. Por falha no controle de acesso, 1.400 participantes entram no local. O Corpo de Bombeiros aparece para fiscalizacao de rotina e constata a superlotacao. O gestor e chamado.',
    question: 'Como o bacharel em EF deve agir para minimizar riscos legais e garantir a seguranca?',
    options: [
      'Pedir ao Corpo de Bombeiros que retorne apos o evento para nao criar panico',
      'Acionar imediatamente o protocolo de controle de capacidade, suspender novas entradas, colaborar com a fiscalizacao e registrar todas as acoes para o pos-evento',
      'Argumentar que o local comporta mais pessoas do que o alvara indica',
      'Encerrar o evento de forma abrupta sem comunicacao previa aos participantes',
      'Transferir a responsabilidade ao proprietario do local e se retirar da situacao'
    ],
    correctAnswer: 1,
    explanation: 'Seguranca e responsabilidade legal exigem acao imediata, transparencia com orgaos fiscalizadores e documentacao rigorosa para o pos-evento.'
  },
  {
    id: 'j4',
    title: 'Pos-evento estrategico',
    scenario: 'Um grande evento corporativo de lazer foi realizado com sucesso aparente. A equipe esta esgotada e o cliente esta satisfeito. O gestor recebe pressao para fechar imediatamente os contratos e partir para o proximo evento, sem fazer o relatorio pos-evento completo.',
    question: 'Por que a negligencia do pos-evento compromete a inteligencia organizacional do bacharel em EF?',
    options: [
      'Porque o relatorio é exigencia burocrática sem impacto real na carreira',
      'Porque sem o pos-evento o cliente pode nao pagar o valor restante do contrato',
      'Porque o pos-evento e a fase onde se consolida o aprendizado, avaliam-se desvios, fideliza-se o cliente e gera-se conhecimento para futuras edicoes',
      'Porque a legislacao obriga a entrega de relatorios dentro de 30 dias',
      'Porque o pos-evento define o valor do evento nas redes sociais'
    ],
    correctAnswer: 2,
    explanation: 'O pos-evento fecha o ciclo de Fayol (Controlar), gera inteligencia organizacional e e base para fidelizacao e melhoria continua.'
  }
];
