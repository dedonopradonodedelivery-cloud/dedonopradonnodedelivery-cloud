import React, { useState, useEffect } from 'react';
import { Heart, Clock, X, Check, Trophy } from 'lucide-react';

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
    text: 'Qual destas lojas é famosa por seus hambúrgueres artesanais na Freguesia?',
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
    text: 'Quantas lojas da categoria "Saúde" estão cadastradas no app?',
    options: ['Mais de 50', 'Exatamente 12', 'Menos de 10', 'Nenhuma'],
    correctAnswer: 0,
    difficulty: 'hard',
    xp: 40
  }
];

export const QuizView: React.FC<QuizViewProps> = ({ onBack, mode }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(mode === 'lightning' ? 60 : 15);
  const [isFinished, setIsFinished] = useState(false);

  const question = MOCK_QUESTIONS[currentQuestionIdx];

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
  }, [currentQuestionIdx, isFinished, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setLives(prev => Math.max(0, prev - 1));
    setTimeout(nextQuestion, 2000);
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === question.correctAnswer) {
      let earnedXp = question.xp;
      if (timeLeft > 10) earnedXp += 10; // Fast answer bonus
      setScore(prev => prev + earnedXp);
    } else {
      setLives(prev => Math.max(0, prev - 1));
    }
    
    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    if (lives <= 1 && selectedOption !== question.correctAnswer) {
      setIsFinished(true);
      return;
    }
    
    if (currentQuestionIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(mode === 'lightning' ? timeLeft : 15); // Reset or keep timer based on mode
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6">
        <Trophy size={80} className="text-amber-400 mb-6" />
        <h1 className="text-3xl font-black tracking-tighter mb-2">Quiz Concluído!</h1>
        <p className="text-white/60 mb-8">Você ganhou</p>
        <div className="text-6xl font-black text-blue-500 mb-12">+{score} XP</div>
        
        <button 
          onClick={onBack}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="text-white/50 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="flex-1 mx-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIdx) / MOCK_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-rose-500 font-bold">
          <Heart size={20} className="fill-rose-500" />
          {lives}
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            question.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
            question.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
            'bg-rose-500/20 text-rose-400'
          }`}>
            {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
          </span>
          
          <div className="flex items-center gap-2 text-white/50 font-mono text-lg">
            <Clock size={18} />
            <span className={timeLeft <= 5 ? 'text-rose-500 animate-pulse' : ''}>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>

        <h2 className="text-2xl font-black leading-tight mb-12">
          {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-3 mt-auto">
          {question.options.map((opt, idx) => {
            let btnClass = "w-full p-5 rounded-2xl border-2 text-left font-bold transition-all ";
            
            if (!isAnswered) {
              btnClass += "border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.98]";
            } else {
              if (idx === question.correctAnswer) {
                btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-400";
              } else if (idx === selectedOption) {
                btnClass += "border-rose-500 bg-rose-500/20 text-rose-400";
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
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {isAnswered && idx === question.correctAnswer && <Check size={20} />}
                  {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <X size={20} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
