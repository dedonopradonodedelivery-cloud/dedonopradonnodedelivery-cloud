import React, { useState, useEffect } from 'react';
import { Heart, Clock, X, Check, Trophy, Flame, RefreshCw, Home } from 'lucide-react';

interface QuizViewProps {
  onBack: () => void;
  mode: 'daily' | 'lightning';
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'Qual destas hamburguerias é famosa por seus blends artesanais na Freguesia?',
    options: ['Pizzaria do Bairro', 'Burger King', 'Freguesia Burger', 'Sushi JPA'],
    correctAnswer: 2,
    difficulty: 'easy',
    xp: 10
  },
  {
    id: '2',
    text: 'Qual é a rua principal de comércio no centro da Freguesia?',
    options: ['Estrada dos Três Rios', 'Avenida das Américas', 'Rua Tirol', 'Estrada de Jacarepaguá'],
    correctAnswer: 0,
    difficulty: 'medium',
    xp: 20
  },
  {
    id: '3',
    text: 'Qual shopping fica localizado no coração da Freguesia?',
    options: ['BarraShopping', 'Quality Shopping', 'Center Shopping', 'ParkJacarepaguá'],
    correctAnswer: 1,
    difficulty: 'hard',
    xp: 40
  },
  {
    id: '4',
    text: 'Onde fica localizado o Bosque da Freguesia?',
    options: ['Rua Tirol', 'Estrada do Pau-Ferro', 'Avenida Geremário Dantas', 'Estrada do Gabinal'],
    correctAnswer: 1,
    difficulty: 'medium',
    xp: 20
  },
  {
    id: '5',
    text: 'Qual é o nome da praça principal do Anil?',
    options: ['Praça Seca', 'Praça do Anil', 'Praça da Freguesia', 'Largo do Anil'],
    correctAnswer: 3,
    difficulty: 'easy',
    xp: 10
  }
];

export const QuizView: React.FC<QuizViewProps> = ({ onBack, mode }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Game State
  const [prestigioRodada, setPrestigioRodada] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(mode === 'lightning' ? 60 : 15);
  const [isFinished, setIsFinished] = useState(false);

  // Get a random question for infinite mode
  const [question, setQuestion] = useState<Question>(MOCK_QUESTIONS[0]);

  useEffect(() => {
    // Pick a random question on start
    setQuestion(MOCK_QUESTIONS[Math.floor(Math.random() * MOCK_QUESTIONS.length)]);
  }, []);

  useEffect(() => {
    if (isFinished || isAnswered) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [question, isFinished, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setLives(prev => Math.max(0, prev - 1));
    setStreak(0);
    setTimeout(nextQuestion, 2000);
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === question.correctAnswer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      
      let earnedXp = question.xp;
      if (timeLeft > 10) earnedXp += 10; // Fast answer bonus
      if (newStreak >= 5) earnedXp += 30; // Streak bonus
      
      setPrestigioRodada(prev => prev + earnedXp);
    } else {
      setLives(prev => Math.max(0, prev - 1));
      setStreak(0);
    }
    
    setTimeout(nextQuestion, 1500); // Faster transition for infinite mode
  };

  const nextQuestion = () => {
    if (lives <= 1 && selectedOption !== question.correctAnswer && selectedOption !== null) {
      // If they just lost their last life
      setIsFinished(true);
      return;
    }
    if (lives === 0) {
      setIsFinished(true);
      return;
    }
    
    // Pick next random question (try to avoid repeating the exact same one immediately)
    let nextQ = MOCK_QUESTIONS[Math.floor(Math.random() * MOCK_QUESTIONS.length)];
    while (nextQ.id === question.id && MOCK_QUESTIONS.length > 1) {
      nextQ = MOCK_QUESTIONS[Math.floor(Math.random() * MOCK_QUESTIONS.length)];
    }
    
    setQuestion(nextQ);
    setCurrentQuestionIdx(prev => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(mode === 'lightning' ? timeLeft : 15);
  };

  const handleRestart = () => {
    setLives(3);
    setPrestigioRodada(0);
    setStreak(0);
    setMaxStreak(0);
    setCurrentQuestionIdx(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(mode === 'lightning' ? 60 : 15);
    setQuestion(MOCK_QUESTIONS[Math.floor(Math.random() * MOCK_QUESTIONS.length)]);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 relative">
        {/* Fixed Full Bleed Background */}
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#0a192f] -z-10" />
        
        {/* Background Animated Gradients */}
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          <Trophy size={80} className="text-amber-400 mb-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]" />
          <h1 className="text-3xl font-black tracking-tighter mb-2">Fim da Rodada!</h1>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 w-full mt-6 mb-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <p className="text-white/60 mb-2 font-bold uppercase tracking-widest text-xs">Recompensa Total</p>
              <div className="text-6xl font-black text-blue-500 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">+{prestigioRodada}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                <Flame size={24} className="text-amber-500 mx-auto mb-2" />
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Max Streak</p>
                <p className="text-2xl font-black text-white">{maxStreak}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                <Check size={24} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Acertos</p>
                <p className="text-2xl font-black text-white">{currentQuestionIdx}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Ranking Semanal</span>
                  <span className="text-lg font-black text-white">12º Lugar <span className="text-emerald-400 text-sm">↑ 3</span></span>
                </div>
                <Trophy size={24} className="text-amber-400 opacity-50" />
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Nível 2</span>
                    <span className="text-sm font-black text-white">Explorador</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400">850 / 1000</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%] relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <button 
              onClick={handleRestart}
              className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl active:scale-95 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] relative overflow-hidden flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
              <RefreshCw size={20} className="relative z-10" />
              <span className="relative z-10">Jogar Novamente</span>
            </button>
            
            <button 
              onClick={onBack}
              className="w-full bg-white/5 text-white font-black uppercase tracking-widest py-4 rounded-2xl active:scale-95 transition-all border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>Voltar para Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col font-sans relative pb-24">
      {/* Fixed Full Bleed Background */}
      <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#0a192f] -z-10" />
      
      {/* Background Animated Gradients */}
      <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[30%] left-[10%] w-[80%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
          
          <div className="flex-1 mx-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Trophy size={14} className="text-blue-400" />
              <span className="text-sm font-black text-blue-400">{prestigioRodada}</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1 text-amber-500 animate-in zoom-in duration-300">
                <Flame size={16} className="fill-amber-500" />
                <span className="text-sm font-black">{streak}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-rose-500 font-bold bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
            <Heart size={16} className="fill-rose-500" />
            <span>{lives}</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col px-6 pt-4">
          <div className="flex items-center justify-between mb-6">
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              question.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              question.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
            </span>
            
            <div className="flex items-center gap-2 text-white/50 font-mono text-lg bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Clock size={16} />
              <span className={timeLeft <= 5 ? 'text-rose-500 animate-pulse font-bold' : 'font-bold'}>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)] -z-10 blur-xl"></div>
            <h2 className="text-2xl md:text-3xl font-black leading-tight text-center drop-shadow-md">
              {question.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let btnClass = "w-full p-5 rounded-2xl border-2 text-left font-bold transition-all relative overflow-hidden ";
              
              if (!isAnswered) {
                btnClass += "border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.98]";
              } else {
                if (idx === question.correctAnswer) {
                  btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                } else if (idx === selectedOption) {
                  btnClass += "border-rose-500 bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]";
                } else {
                  btnClass += "border-white/5 bg-transparent opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-lg">{opt}</span>
                    {isAnswered && idx === question.correctAnswer && <Check size={24} className="text-emerald-400" />}
                    {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <X size={24} className="text-rose-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

