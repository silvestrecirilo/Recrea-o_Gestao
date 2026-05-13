import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Clock, 
  BarChart3, 
  ShieldAlert,
  Zap,
  Target,
  Award,
  Shield,
  Star,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Sparkles,
  Users,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from './lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  setDoc, 
  doc, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { CRISES, BENEFITS, JOKERS, CrisisCard, BenefitCard, JokerQuestion } from './cards';

// --- Types ---
type Complexity = 'Baixa' | 'Média' | 'Alta';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  complexity: Complexity;
  explanation: string;
}

interface PlayerRecord {
  id: string;
  name: string;
  score: number;
}

// --- Data ---
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Segundo Marlene Matias (2013), qual é a definição de evento?",
    options: [
      "A realização de atividades físicas em espaços públicos com fins recreativos.",
      "A reunião de pessoas em local, data e horário previamente determinados, visando a troca ou apresentação de ideias, produtos ou serviços, com objetivos específicos.",
      "Qualquer atividade de lazer que envolva mais de 50 participantes em ambiente controlado.",
      "O conjunto de práticas culturais organizadas por instituições públicas para promover a cidadania.",
      "A promoção de atividades esportivas competitivas com regulamentação oficial."
    ],
    correctAnswer: 1,
    complexity: "Baixa",
    explanation: "Eventos são reuniões planejadas com local, data e hora definidos para objetivos específicos de troca de ideias ou produtos."
  },
  {
    id: 2,
    text: "Quais são as três fases de um evento, conforme apresentadas na aula?",
    options: [
      "Inauguração, desenvolvimento e conclusão.",
      "Divulgação, realização e patrocínio.",
      "Pré-evento, trans evento e pós-evento.",
      "Captação, execução e liquidação.",
      "Briefing, rundown e desmobilização."
    ],
    correctAnswer: 2,
    complexity: "Baixa",
    explanation: "As três fases clássicas são o planejamento (pré), a execução (trans) e a finalização/avaliação (pós)."
  },
  {
    id: 3,
    text: "O que é o Rundown de um evento?",
    options: [
      "Um formulário de inscrição de participantes.",
      "O plano de contingência para situações de emergência.",
      "O documento minuto a minuto com todas as atrações, transições e responsáveis por cada momento do evento.",
      "O relatório final entregue aos patrocinadores após o evento.",
      "A planilha de controle financeiro do orçamento do evento."
    ],
    correctAnswer: 2,
    complexity: "Baixa",
    explanation: "O Rundown é o roteiro detalhado (minuto a minuto) da execução do evento."
  },
  {
    id: 4,
    text: "Qual fase do evento é considerada a mais longa e a mais determinante para o sucesso?",
    options: [
      "Trans evento.",
      "Pós-evento.",
      "Desmobilização.",
      "Pré-evento.",
      "Execução."
    ],
    correctAnswer: 3,
    complexity: "Baixa",
    explanation: "O pré-evento é onde todo o planejamento ocorre, sendo a fase mais extensa e crucial."
  },
  {
    id: 5,
    text: "De acordo com Allen et al. (2012), como são classificados eventos com público acima de 10.000 pessoas?",
    options: [
      "Mega-eventos.",
      "Hallmark Events.",
      "Eventos locais/comunitários.",
      "Grandes eventos.",
      "Eventos de médio porte."
    ],
    correctAnswer: 3,
    complexity: "Baixa",
    explanation: "Eventos acima de 10.000 pessoas são tecnicamente 'Grandes Eventos'."
  },
  {
    id: 6,
    text: "O que é um Checklist mestre no contexto do pré-evento?",
    options: [
      "Um documento com o histórico financeiro dos eventos anteriores.",
      "Um documento que lista todas as tarefas a serem realizadas, com responsável, prazo e status de execução.",
      "A lista de convidados e participantes confirmados para o evento.",
      "O plano de comunicação nas redes sociais do evento.",
      "O contrato firmado com os fornecedores e patrocinadores."
    ],
    correctAnswer: 1,
    complexity: "Baixa",
    explanation: "É a ferramenta de controle de tarefas, prazos e responsáveis durante o planejamento."
  },
  {
    id: 7,
    text: "Qual é o principal produto final da fase de pós-evento?",
    options: [
      "O contrato com o local do próximo evento.",
      "A lista de presença atualizada e assinada pelos participantes.",
      "O relatório final e as ações de fidelização.",
      "O orçamento revisado para a próxima edição.",
      "O material de divulgação e as artes gráficas do evento."
    ],
    correctAnswer: 2,
    complexity: "Baixa",
    explanation: "O relatório final encerra o ciclo e as ações de fidelização preparam o terreno para o futuro."
  },
  {
    id: 8,
    text: "O que é o organograma de um evento?",
    options: [
      "A linha do tempo do projeto com marcos e entregas definidos.",
      "A representação gráfica da estrutura hierárquica e funcional da equipe do evento.",
      "O protocolo de resposta para situações imprevistas.",
      "O documento de registro fotográfico e videográfico do evento.",
      "A estratégia de divulgação nas redes sociais."
    ],
    correctAnswer: 1,
    complexity: "Baixa",
    explanation: "Organograma define quem faz o quê e quem responde a quem na hierarquia do evento."
  },
  {
    id: 9,
    text: "O Carnaval do Rio de Janeiro e a Oktoberfest de Blumenau são exemplos de qual categoria de eventos, segundo Allen et al. (2012)?",
    options: [
      "Mega-eventos.",
      "Grandes eventos.",
      "Hallmark Events.",
      "Eventos de médio porte.",
      "Eventos locais/comunitários."
    ],
    correctAnswer: 2,
    complexity: "Baixa",
    explanation: "Hallmark Events são eventos tão ligados a um local que se tornam sua marca (identidade)."
  },
  {
    id: 10,
    text: "Qual ferramenta de comunicação em tempo real é mencionada na aula para uso durante a execução do evento?",
    options: [
      "E-mail marketing e newsletter.",
      "Walkie-talkies ou grupo de WhatsApp da equipe.",
      "Transmissão ao vivo nas redes sociais.",
      "Quadro de avisos no posto de coordenação.",
      "Aplicativo exclusivo de gestão de eventos."
    ],
    correctAnswer: 1,
    complexity: "Baixa",
    explanation: "Comunicação instantânea é vital no trans evento (WhatsApp/Rádios)."
  },
  {
    id: 11,
    text: "Segundo as funções de Fayol aplicadas à gestão de eventos, quais funções predominam na fase de trans evento?",
    options: [
      "Planejar e Organizar.",
      "Organizar e Controlar.",
      "Coordenar e Comandar.",
      "Planejar e Controlar.",
      "Comandar e Organizar."
    ],
    correctAnswer: 2,
    complexity: "Média",
    explanation: "No trans evento (execução), o foco é fazer acontecer (comandar) e manter a sincronia (coordenar)."
  },
  {
    id: 12,
    text: "Qual é a característica que diferencia um profissional de Educação Física que domina a gestão de eventos de um 'animador'?",
    options: [
      "A capacidade de realizar atividades físicas de alto rendimento durante o evento.",
      "O conhecimento de regras esportivas e a arbitragem de competições.",
      "A entrega de experiências completas com planejamento, execução e avaliação mensuráveis.",
      "A habilidade de contratar fornecedores com menor custo.",
      "A capacidade de improvisar atividades no momento do evento sem planejamento prévio."
    ],
    correctAnswer: 2,
    complexity: "Média",
    explanation: "O gestor entrega um processo completo e técnico, não apenas a atividade em si."
  },
  {
    id: 13,
    text: "Por que o pós-evento é considerado uma fase estratégica?",
    options: [
      "Porque é nessa fase que o evento é divulgado ao grande público.",
      "Porque permite fechar o ciclo do evento e gerar inteligência para os próximos.",
      "Porque é quando os patrocinadores decidem o valor do próximo investimento.",
      "Porque é a única fase em que os participantes podem avaliar o recreador.",
      "Porque permite reorganizar a equipe antes do próximo evento."
    ],
    correctAnswer: 1,
    complexity: "Média",
    explanation: "É a fase de 'inteligência organizacional', onde se aprende com o que foi feito."
  },
  {
    id: 14,
    text: "O plano de contingência, elaborado na fase de pré-evento, tem como função principal:",
    options: [
      "Reduzir o custo total do evento por meio de alternativas mais baratas.",
      "Substituir o cronograma quando houver atrasos na programação.",
      "Estabelecer protocolos de resposta para situações imprevistas.",
      "Definir o roteiro das atividades recreativas em caso de desistência de participantes.",
      "Servir como plano de marketing alternativo caso a divulgação principal não funcione."
    ],
    correctAnswer: 2,
    complexity: "Média",
    explanation: "Contingência é o 'Plano B' para quando algo sai do controle."
  },
  {
    id: 15,
    text: "Qual é o principal risco identificado na fase de trans evento no quadro comparativo da aula?",
    options: [
      "Subplanejamento e esquecimento de detalhes.",
      "Não documentar os aprendizados do evento.",
      "Falha de comunicação e decisões precipitadas.",
      "Ausência de patrocinadores confirmados.",
      "Superestimação do público esperado."
    ],
    correctAnswer: 2,
    complexity: "Média",
    explanation: "No calor da execução, o maior risco são as falhas de comunicação e o estresse na tomada de decisões."
  },
  {
    id: 16,
    text: "A análise SWOT, as funções de Fayol e a definição de missão, indicam que a gestão de eventos de lazer:",
    options: [
      "É uma área exclusiva da administração de empresas.",
      "Articula fundamentos administrativos com a prática do recreador.",
      "Dispensa o planejamento formal quando o profissional possui vasta experiência.",
      "Aplica-se apenas a mega-eventos.",
      "Substitui a formação em Educação Física por conhecimentos gerenciais."
    ],
    correctAnswer: 1,
    complexity: "Média",
    explanation: "A gestão profissional unifica técnica administrativa com a expertise da área (recreação/esporte)."
  },
  {
    id: 17,
    text: "No contexto do pré-evento, o plano de comunicação tem como objetivo:",
    options: [
      "Treinar a equipe para lidar com a imprensa.",
      "Definir a estratégia de divulgação global do evento.",
      "Registrar as comunicações internas da equipe.",
      "Elaborar o roteiro das falas dos apresentadores.",
      "Controlar o fluxo de informações entre fornecedores."
    ],
    correctAnswer: 1,
    complexity: "Média",
    explanation: "Comunicação externa (divulgação) é fundamental para levar público ao evento."
  },
  {
    id: 18,
    text: "A desmobilização envolve:",
    options: [
      "A divulgação dos resultados do evento nas redes sociais.",
      "A seleção da equipe para o próximo evento.",
      "A devolução de equipamentos, pagamentos, limpeza e prestação de contas.",
      "A aplicação de pesquisa de satisfação.",
      "A elaboração do orçamento da próxima edição."
    ],
    correctAnswer: 2,
    complexity: "Média",
    explanation: "Desmobilizar é desmontar fisicamente e juridicamente o evento (contas, limpeza, devoluções)."
  },
  {
    id: 19,
    text: "Se um sistema de som falha e o fornecedor some numa olimpíada empresarial, qual a conduta ideal?",
    options: [
      "Cancelar imediatamente a atividade afetada.",
      "Acionar o plano de contingência, decidir rápido via rundown e comunicar a equipe via WhatsApp.",
      "Aguardar o retorno do fornecedor antes de agir.",
      "Transferir a responsabilidade para o audiovisual.",
      "Registrar o ocorrido no relatório final e compensar depois."
    ],
    correctAnswer: 1,
    complexity: "Alta",
    explanation: "Gestão é agir com base no que foi planejado (contingência) e manter o fluxo (rundown)."
  },
  {
    id: 20,
    text: "Um gestor que decide não fazer pesquisa, relatório ou agradecimentos compromete:",
    options: [
      "Apenas a função de Coordenar.",
      "Apenas o orçamento da próxima edição.",
      "A função de Controlar, a inteligência organizacional e a fidelização.",
      "Somente a relação com os patrocinadores.",
      "A fase de pré-evento da próxima edição apenas."
    ],
    correctAnswer: 2,
    complexity: "Alta",
    explanation: "O pós-evento é essencial para o controle e para a continuidade sustentável do negócio de eventos."
  }
];

// --- Components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

const ComplexityBadge = ({ type }: { type: Complexity }) => {
  const styles = {
    'Baixa': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    'Média': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    'Alta': 'bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
  };
  
  return (
    <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${styles[type]}`}>
      {type === 'Alta' && <ShieldAlert className="w-3 h-3" />}
      {type === 'Média' && <Target className="w-3 h-3" />}
      {type === 'Baixa' && <Zap className="w-3 h-3" />}
      {type} COMPLEXIDADE
    </span>
  );
};

// --- Utility ---
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'quiz' | 'result'>('start');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [ranking, setRanking] = useState<PlayerRecord[]>([]);
  const [showProjection, setShowProjection] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Cards State
  const [activeCrisis, setActiveCrisis] = useState<CrisisCard | null>(null);
  const [activeBenefit, setActiveBenefit] = useState<BenefitCard | null>(null);
  const [activeJoker, setActiveJoker] = useState<JokerQuestion | null>(null);
  const [shields, setShields] = useState(0);
  const [doubleXP, setDoubleXP] = useState(false);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Sync with Firestore Leaderboard
  useEffect(() => {
    const q = query(collection(db, "players"), orderBy("score", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PlayerRecord[];
      setRanking(records);
    });
    return () => unsubscribe();
  }, []);

  // Persist Score
  useEffect(() => {
    if (playerId && gameState !== 'start') {
      const playerDoc = doc(db, "players", playerId);
      updateDoc(playerDoc, {
        score: score,
        lastUpdated: serverTimestamp()
      }).catch(err => console.error("Error updating score:", err));
    }
  }, [score, playerId, gameState]);

  const clearLeaderboard = async () => {
    if (!window.confirm("Deseja realmente apagar todo o ranking? Esta ação é irreversível.")) return;
    
    setIsClearing(true);
    try {
      const q = query(collection(db, "players"));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      confetti({ particleCount: 100, colors: ['#f43f5e'] });
    } catch (err) {
      console.error("Error clearing leaderboard:", err);
      alert("Erro ao limpar o ranking. Verifique o console.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleStart = async () => {
    if (!playerName.trim()) return;
    
    // Shuffle questions and their options
    const randomizedQuestions = shuffleArray(QUESTIONS).map(q => {
      const originalCorrectOption = q.options[q.correctAnswer];
      const shuffledOptions = shuffleArray(q.options);
      const newCorrectAnswerIndex = shuffledOptions.indexOf(originalCorrectOption);
      return {
        ...q,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswerIndex
      };
    });
    setShuffledQuestions(randomizedQuestions);

    // Create uniquely identified player
    const newId = `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setPlayerId(newId);
    
    try {
      await setDoc(doc(db, "players", newId), {
        name: playerName,
        score: 0,
        lastUpdated: serverTimestamp()
      });
      setGameState('quiz');
      setCurrentQuestionIndex(0);
      setScore(0);
      setStreak(0);
      setShields(0);
      setDoubleXP(false);
      setScoreMultiplier(1);
    } catch (err) {
      console.error("Error creating player:", err);
    }
  };

  const triggerCard = useCallback((type: 'crisis' | 'benefit') => {
    if (type === 'crisis') {
      if (shields > 0) {
        setShields(prev => prev - 1);
        return; // Blocked by shield!
      }
      const randomCrisis = CRISES[Math.floor(Math.random() * CRISES.length)];
      setActiveCrisis(randomCrisis);
    } else {
      const randomBenefit = BENEFITS[Math.floor(Math.random() * BENEFITS.length)];
      setActiveBenefit(randomBenefit);
    }
  }, [shields]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswer;

    if (isCorrect) {
      let points = (currentQuestion.complexity === 'Alta' ? 150 : currentQuestion.complexity === 'Média' ? 100 : 50);
      if (doubleXP) {
        points *= 2;
        setDoubleXP(false);
      }
      setScore(prev => Math.round(prev + points));
      setStreak(prev => prev + 1);

      // Confetti for long streak
      if (streak > 2) {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setStreak(0);
    }
  };

  const handleCrisisSolve = (solved: boolean) => {
    if (!activeCrisis) return;
    if (solved) {
      setScore(prev => prev + activeCrisis.onSuccess);
      confetti({ particleCount: 30, colors: ['#10b981'] });
    } else {
      setScore(prev => Math.max(0, prev + activeCrisis.onFailure));
    }
    setActiveCrisis(null);
  };

  const handleBenefitSolve = (solved: boolean) => {
    if (!activeBenefit) return;
    if (solved) {
      switch (activeBenefit.effect) {
        case 'direto':
          setScore(prev => prev + activeBenefit.value);
          break;
        case 'proxima':
          setDoubleXP(true);
          break;
        case 'escudo':
          setShields(prev => prev + activeBenefit.value);
          break;
        case 'multiplicador':
          setScoreMultiplier(prev => prev * activeBenefit.value);
          break;
      }
      confetti({ particleCount: 40, colors: ['#6366f1'] });
    } else {
      // Small penalty for missing a benefit choice? Let's say no benefit applied.
    }
    setActiveBenefit(null);
  };

  const handleJokerSolve = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 300);
      triggerCard('benefit'); // Guaranteed benefit
      confetti({ particleCount: 100, spread: 70 });
    }
    setActiveJoker(null);
  };

  const nextQuestion = () => {
    // Every 2 questions, trigger an event
    const questionNumber = currentQuestionIndex + 1;
    if (questionNumber % 2 === 0) {
      const type = Math.random() < 0.5 ? 'crisis' : 'benefit';
      setTimeout(() => triggerCard(type), 300);
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);

      // Joker Chance (Streak based)
      if (streak === 5 || streak === 10) {
        const randomJoker = JOKERS[Math.floor(Math.random() * JOKERS.length)];
        setActiveJoker(randomJoker);
      }
    } else {
      // Game End
      setScore(prev => Math.round(prev * scoreMultiplier));
      setGameState('result');
      if (score > 1500) {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className={`min-h-screen ${showProjection ? 'bg-slate-950 overflow-hidden' : 'bg-slate-50 overflow-hidden'} text-slate-900 flex flex-col font-sans`}>
      {/* Projection Mode Overlay */}
      <AnimatePresence>
        {showProjection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#fafaf9] flex flex-col p-12 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-12 border-b border-slate-200 pb-8">
              <div>
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">RANKING EM TEMPO REAL</h1>
                <p className="text-indigo-600 font-mono tracking-widest uppercase text-sm font-bold">Aula 07: Gestão e Logística de Eventos</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={clearLeaderboard}
                  disabled={isClearing}
                  className="p-4 bg-white border border-rose-100 hover:bg-rose-50 text-rose-500 rounded-full transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
                  title="Apagar todos os registros"
                >
                  <Trash2 size={32} />
                </button>
                <button 
                  onClick={() => setShowProjection(false)}
                  className="p-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full transition-all shadow-sm flex items-center justify-center"
                >
                  <Minimize2 size={32} />
                </button>
              </div>
            </div>

            <div className="flex-grow grid grid-cols-1 gap-6 max-w-5xl mx-auto w-full content-start">
              {ranking.map((user, idx) => (
                <motion.div 
                  layout
                  key={user.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${
                    user.id === playerId 
                      ? 'bg-indigo-600 border-indigo-400 shadow-[0_20px_50px_rgba(79,70,229,0.2)] scale-105 z-10' 
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                  }`}
                >
                   {/* Rank background glass effect for top 3 */}
                   {idx < 3 && (
                    <div className={`absolute top-0 left-0 w-3 h-full ${
                      idx === 0 ? 'bg-amber-400' : 
                      idx === 1 ? 'bg-slate-300' : 
                      'bg-orange-400'
                    }`} />
                  )}

                  <div className="flex items-center gap-14">
                    <div className="relative">
                       <span className={`text-7xl font-display font-black min-w-[140px] block ${
                        idx === 0 ? 'text-amber-400' : 
                        idx === 1 ? 'text-slate-300' : 
                        idx === 2 ? 'text-orange-300' : 
                        (user.id === playerId ? 'text-indigo-400' : 'text-slate-100')
                      }`}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-4xl font-display font-medium ${user.id === playerId ? 'text-white' : 'text-slate-800'}`}>
                        {user.name}
                      </span>
                      {idx === 0 && <span className="text-amber-500 text-sm font-bold uppercase tracking-[0.25em] mt-1 flex items-center gap-2">
                        <Trophy size={16} /> Dominância de Mercado
                      </span>}
                      {user.id === playerId && <span className="text-indigo-200 text-sm font-bold uppercase tracking-[0.25em] mt-1">Sua Performance Atual</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-6xl font-mono font-bold ${user.id === playerId ? 'text-white' : 'text-emerald-600'}`}>
                      {user.score.toLocaleString()}
                    </span>
                    <span className={`block text-xs uppercase tracking-[0.3em] mt-2 font-bold ${user.id === playerId ? 'text-indigo-100' : 'text-slate-400'}`}>
                      XP ACUMULADO
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="h-20 flex items-center justify-center text-slate-400 font-mono text-sm tracking-[0.4em] uppercase">
              Gerando Inteligência em Tempo Real // Sync: Ativo
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 md:h-20 border-b border-slate-200 bg-white/80 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-indigo-100 text-white shrink-0">E</div>
          <div className="hidden sm:block">
            <h1 className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Event Master Quiz</h1>
            <p className="text-[10px] md:text-xs text-indigo-600">AULA 07: GESTÃO E LOGÍSTICA</p>
          </div>
          <div className="sm:hidden">
            <p className="text-[10px] md:text-xs text-indigo-600 font-bold">AULA 07</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {gameState === 'quiz' && (
            <div className="flex items-center gap-3 md:gap-6 lg:gap-12">
              {/* Mobile Score Badge */}
              <div className="flex lg:hidden flex-col items-end">
                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-tighter">XP TOTAL</span>
                <span className="font-mono text-sm font-bold text-emerald-600">{score.toLocaleString()}</span>
              </div>

              {/* Desktop Full Stats */}
              <div className="hidden lg:flex items-center gap-12">
                <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  {shields > 0 && (
                    <div className="flex items-center gap-1 text-blue-600 font-bold border-r border-slate-200 pr-4 mr-2">
                      <Shield size={18} fill="currentColor" /> {shields}
                    </div>
                  )}
                  {doubleXP && (
                    <div className="flex items-center gap-1 text-amber-600 font-bold border-r border-slate-200 pr-4 mr-2">
                      <Zap size={18} fill="currentColor" /> 2X
                    </div>
                  )}
                  <div className="flex flex-col items-end">
                    <span className="label-caps">Progresso</span>
                    <div className="flex items-center gap-3">
                      <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all"
                          style={{ width: `${((currentQuestionIndex + 1) / (shuffledQuestions.length || QUESTIONS.length)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600">{currentQuestionIndex + 1}/{shuffledQuestions.length || QUESTIONS.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white px-4 py-1 rounded border border-slate-200">
                    <span className="label-caps block">Score</span>
                    <span className="font-mono text-emerald-600 font-bold">{score} XP</span>
                  </div>
                  <div className="bg-white px-4 py-1 rounded border border-slate-200">
                    <span className="label-caps block">Streak</span>
                    <span className="font-mono text-orange-600 font-bold">🔥 {streak.toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={() => setShowProjection(true)}
            className="p-2 md:p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 font-bold text-[10px] md:text-xs uppercase tracking-widest"
          >
            <Maximize2 size={16} /> <span className="hidden sm:inline">Projetar Ranking</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex p-4 md:p-6 gap-6 relative overflow-hidden">
        {/* Sidebar: Ranking */}
        {gameState !== 'start' && (
          <aside className="hidden lg:flex w-72 flex-col gap-6 shrink-0">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-stretch gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-50" />
              <h2 className="label-caps !text-slate-400 border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><BarChart3 size={14} /> Ranking Real-Time</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearLeaderboard}
                    disabled={isClearing}
                    className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded transition-colors disabled:opacity-50"
                    title="Apagar Ranking"
                  >
                    <Trash2 size={12} />
                  </button>
                  <Users size={12} className="text-indigo-400" />
                </div>
              </h2>
              <div className="space-y-3">
                {ranking.map((user, idx) => (
                  <motion.div 
                    layout
                    key={user.id}
                    className={`flex items-center justify-between text-sm p-3 rounded-xl transition-all border ${
                      user.id === playerId 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-100 scale-105 z-10' 
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold
                        ${idx === 0 ? 'bg-amber-100 text-amber-600' : 
                          idx === 1 ? 'bg-slate-100 text-slate-500' : 
                          idx === 2 ? 'bg-orange-100 text-orange-700' : 
                          (user.id === playerId ? 'text-indigo-200' : 'text-slate-400')}
                      `}>
                        {idx + 1}
                      </span>
                      <span className={`font-medium truncate max-w-[120px] ${user.id === playerId ? 'text-white' : 'text-slate-700'}`}>
                        {user.name}
                      </span>
                    </div>
                    <span className={`font-mono font-bold ${user.id === playerId ? 'text-indigo-100' : 'text-emerald-600'}`}>
                      {user.score.toLocaleString()} XP
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
              <h3 className="label-caps !text-amber-600 text-[9px]">Insight da Aula 07</h3>
              <p className="text-xs text-amber-800 leading-relaxed italic">
                "O gestor competente não apenas faz, ele planeja, coordena e controla o ciclo completo."
              </p>
            </div>
          </aside>
        )}

        <section className="flex-grow flex flex-col overflow-y-auto">
          <AnimatePresence mode="wait">
            {gameState === 'start' && (
              <motion.div 
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="m-auto max-w-2xl w-full text-center space-y-8 md:space-y-12 py-8 md:py-12"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4">
                    <Sparkles size={12} /> Gamificação Ativada
                  </div>
                  <h2 className="text-3xl md:text-6xl font-display font-light text-slate-900 tracking-tight leading-tight">
                    Eleve sua Gestão a um <br className="hidden md:block" />
                    <span className="text-indigo-600 font-medium">Nível Profissional</span>
                  </h2>
                  <p className="text-slate-500 text-base md:text-lg max-w-lg mx-auto">
                    Aplicações reais dos fundamentos administrativos de Fayol na Educação Física e Lazer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { label: 'Cartas Crise', value: '16', icon: <AlertTriangle className="text-rose-500" /> },
                    { label: 'Cartas Benefício', value: '16', icon: <Sparkles className="text-blue-500" /> },
                    { label: 'Desafios Coringa', value: '08', icon: <Star className="text-amber-500" /> },
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center gap-3 shadow-sm hover:border-indigo-200 transition-colors">
                      {item.icon}
                      <div className="text-center">
                        <p className="text-2xl font-mono font-bold text-slate-900">{item.value}</p>
                        <p className="label-caps !tracking-[0.1em]">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div className="relative group text-left">
                    <label className="label-caps !text-slate-400 mb-2 block ml-1">Seu Nome para o Ranking</label>
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-indigo-500 rounded-xl opacity-20 group-focus-within:opacity-40 blur transition-opacity"></div>
                      <input 
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Ex: Marlene Matias"
                        className="relative w-full px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleStart}
                    disabled={!playerName.trim()}
                    className="group relative w-full px-12 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"
                  >
                    Iniciar Terminal de Teste <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'quiz' && currentQuestion && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-grow flex flex-col gap-6 max-w-5xl mx-auto w-full py-4 relative"
              >
                {/* Modal for Crisis */}
                <AnimatePresence>
                  {activeCrisis && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-rose-950/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                      <motion.div 
                        initial={{ scale: 0.8, y: 40 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white border-4 border-rose-500 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl space-y-8"
                      >
                        <div className="flex justify-center">
                          <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center animate-pulse">
                            <AlertTriangle size={48} />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <span className="px-3 py-1 bg-rose-500 text-white rounded text-[10px] font-black uppercase tracking-widest">Protocolo de Crise</span>
                          <span className="block text-[8px] text-rose-300 uppercase font-bold tracking-[0.2em]">Contexto Operacional</span>
                          <h3 className="text-xl md:text-3xl font-display font-bold text-rose-900 leading-tight">{activeCrisis.title}</h3>
                          <p className="text-rose-700/70 text-sm md:text-base font-medium italic">"{activeCrisis.description}"</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {activeCrisis.options.map((opt, i) => (
                            <button 
                              key={i}
                              onClick={() => handleCrisisSolve(i === activeCrisis.correctAnswer)}
                              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-white text-left transition-all flex items-center gap-3 group"
                            >
                              <span className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-mono text-slate-400 group-hover:text-indigo-600 transition-colors">{String.fromCharCode(65+i)}</span>
                              <span className="text-slate-700 font-medium">{opt}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Modal for Benefit */}
                <AnimatePresence>
                  {activeBenefit && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-indigo-950/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                      <motion.div 
                        initial={{ rotate: -5, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className="bg-white border-4 border-indigo-500 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl space-y-8"
                      >
                        <div className="flex justify-center">
                          <div className="relative">
                            <Sparkles className="text-amber-400 absolute -top-4 -right-4 animate-bounce" size={40} />
                            <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-xl rotate-3">
                              <Star size={48} fill="currentColor" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded text-[10px] font-black uppercase tracking-widest">Carta de Benefício</span>
                          <span className="block text-[8px] text-indigo-300 uppercase font-bold tracking-[0.2em]">Cenário Favorável</span>
                          <h3 className="text-xl md:text-3xl font-display font-bold text-indigo-900 leading-tight">{activeBenefit.title}</h3>
                          <p className="text-indigo-600/70 text-sm md:text-base font-medium italic">"{activeBenefit.description}"</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {activeBenefit.options.map((opt, i) => (
                            <button 
                              key={i}
                              onClick={() => handleBenefitSolve(i === activeBenefit.correctAnswer)}
                              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-white text-left transition-all flex items-center gap-3 group"
                            >
                              <span className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-mono text-slate-400 group-hover:text-indigo-600 transition-colors">{String.fromCharCode(65+i)}</span>
                              <span className="text-slate-700 font-medium">{opt}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Modal for Joker Challenge */}
                <AnimatePresence>
                  {activeJoker && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center p-6 md:p-12 overflow-y-auto"
                    >
                      <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="max-w-4xl w-full space-y-12 my-auto"
                      >
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-6xl shadow-2xl shadow-indigo-500/50">?</div>
                          <h2 className="text-5xl font-display font-black text-white tracking-widest uppercase italic">Questão Coringa</h2>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-8 relative overflow-hidden">
                          <div className="space-y-4 relative">
                            <span className="label-caps !text-indigo-400">Desafio: {activeJoker.title}</span>
                            <p className="text-2xl text-white font-light leading-relaxed italic border-l-4 border-indigo-500 pl-8">
                              "{activeJoker.scenario}"
                            </p>
                          </div>
                          <div className="space-y-6 relative pt-4 border-t border-slate-800">
                            <h4 className="text-xl text-indigo-100 font-medium">{activeJoker.question}</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {activeJoker.options.map((opt, i) => (
                            <button 
                              key={i}
                              onClick={() => handleJokerSolve(i === activeJoker.correctAnswer)}
                              className="p-5 bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-700 transition-all text-left text-slate-300 font-medium flex items-center gap-4 group"
                            >
                              <span className="w-8 h-8 rounded border border-slate-600 flex items-center justify-center font-mono text-slate-500 group-hover:text-slate-200 transition-colors">{String.fromCharCode(65+i)}</span>
                              {opt}
                            </button>
                          ))}
                        </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-8 flex-grow relative overflow-hidden flex flex-col shadow-sm">
                  <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-indigo-600 pointer-events-none">
                    <ShieldAlert size={280} />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-6 md:mb-8">
                    <ComplexityBadge type={currentQuestion.complexity} />
                    <span className="text-slate-400 font-mono text-[10px] md:text-sm tracking-tighter">
                      ID_QUES_0{currentQuestion.id} // PHASE_{currentQuestion.complexity === 'Baixa' ? '01' : currentQuestion.complexity === 'Média' ? '02' : '03'}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-3xl font-light leading-snug mb-6 md:mb-10 text-slate-900 max-w-3xl">
                    {currentQuestion.text}
                  </h3>

                  <div className="grid grid-cols-1 gap-2 md:gap-3 shrink-0">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(idx)}
                        className={`
                          group relative w-full text-left p-3 md:p-4 rounded-lg border flex items-center gap-3 md:gap-4 transition-all
                          ${!isAnswered ? 'border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-slate-50' : ''}
                          ${isAnswered && idx === currentQuestion.correctAnswer ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : ''}
                          ${isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswer ? 'border-rose-500 bg-rose-50' : 'border-slate-100'}
                          ${isAnswered && idx !== currentQuestion.correctAnswer && selectedOption !== idx ? 'opacity-40' : ''}
                        `}
                      >
                        <span className={`
                          w-6 h-6 md:w-8 md:h-8 shrink-0 rounded border flex items-center justify-center font-mono text-[10px] md:text-sm transition-colors
                          ${isAnswered && idx === currentQuestion.correctAnswer ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}
                          ${isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswer ? 'bg-rose-50 border-rose-500 text-white' : ''}
                        `}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`
                          text-xs md:text-sm font-medium
                          ${isAnswered && idx === currentQuestion.correctAnswer ? 'text-emerald-900' : 'text-slate-700'}
                          ${isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswer ? 'text-rose-900' : ''}
                        `}>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 p-5 rounded-lg bg-indigo-50 border border-indigo-100"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <ShieldAlert size={16} />
                          </div>
                          <div>
                            <h4 className="label-caps !text-indigo-600 mb-1">Nota Técnica</h4>
                            <p className="text-sm text-slate-600 italic">"{currentQuestion.explanation}"</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <footer className="h-20 flex items-center justify-between shrink-0 mb-4">
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 transition-all rounded-full ${i === Math.floor((currentQuestionIndex / (shuffledQuestions.length || QUESTIONS.length)) * 5) ? 'w-8 bg-indigo-600' : 'w-1.5 bg-slate-200'}`}
                      />
                    ))}
                  </div>
                  
                  {isAnswered && (
                    <button 
                      onClick={nextQuestion}
                      className="w-full sm:w-auto px-10 py-4 bg-indigo-600 rounded font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-100 text-white flex items-center justify-center gap-2"
                    >
                      {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Próximo Protocolo' : 'Finalizar Ciclo'} <ArrowRight size={14} />
                    </button>
                  )}
                </footer>
              </motion.div>
            )}

            {gameState === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="m-auto max-w-2xl w-full space-y-10"
              >
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-12 text-center relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
                      <Trophy size={48} />
                    </div>
                  </div>

                  <div className="space-y-2 mb-10">
                    <h2 className="text-3xl font-display font-medium text-slate-900">Ciclo de Gestão Concluído</h2>
                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Relatório Final Gerado</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
                    <div className="bg-slate-50 border border-slate-100 p-4 md:p-6 rounded-2xl">
                      <p className="font-mono text-2xl md:text-3xl font-bold text-emerald-600 mb-1">{score}</p>
                      <p className="label-caps !tracking-[0.15em] !text-[10px]">XP Acumulado</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 md:p-6 rounded-2xl">
                      <p className="font-mono text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                        {Math.round((score / 2500) * 100)}%
                      </p>
                      <p className="label-caps !tracking-[0.15em] !text-[10px]">Desempenho Geral</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => setGameState('start')}
                      className="w-full py-5 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-100"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="h-8 bg-slate-100 border-t border-slate-200 flex items-center px-4 md:px-8 justify-between shrink-0 relative z-40">
        <div className="flex gap-4 md:gap-6 items-center">
          <span className="text-[8px] md:text-[10px] text-indigo-600 font-mono tracking-widest uppercase">Terminal: Online</span>
          <span className="hidden lg:inline text-[10px] text-slate-400 font-mono tracking-widest italic">// GESTOR_ID: {playerId || 'NONE'}</span>
        </div>
        <div className="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest">
          Modo: <span className="text-indigo-600 font-bold">{gameState === 'result' ? 'Finalizado' : 'Execução'}</span>
        </div>
      </footer>
    </div>
  );
}
