export interface Question {
  id: string;
  level: number; // 1 to 15
  category: "KOMPYUTER TUGMALARI" | "SCRATCH" | "PYTHON" | "CANVA";
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface JokerState {
  fiftyFifty: boolean; // true if available, false if used
  friendCall: boolean;
  audiencePoll: boolean;
}

export interface GameState {
  currentLevel: number; // 1 to 15
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
  timeLeft: number;
  gameOver: boolean;
  gameWon: boolean;
  activeQuestion: Question | null;
  friendAdvice: string | null;
  audienceVotes: { A: number; B: number; C: number; D: number } | null;
  eliminatedOptions: ("A" | "B" | "C" | "D")[]; // Options removed by 50/50
  earnedMoney: number;
}
