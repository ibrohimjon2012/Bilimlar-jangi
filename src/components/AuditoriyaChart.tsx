import React from "react";
import { motion } from "motion/react";

interface AuditoriyaChartProps {
  votes: { A: number; B: number; C: number; D: number };
  correctAnswer: "A" | "B" | "C" | "D";
}

export const AuditoriyaChart: React.FC<AuditoriyaChartProps> = ({ votes, correctAnswer }) => {
  const options: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

  return (
    <div id="audience-chart-container" className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-6 backdrop-blur-md max-w-sm w-full mx-auto">
      <h4 className="text-amber-400 font-sans font-semibold text-center mb-4 text-sm tracking-wide uppercase">
        Auditoriya So'rovi Natijalari
      </h4>
      <div className="flex justify-around items-end h-36 gap-2 pt-2">
        {options.map((option) => {
          const percent = votes[option];
          const isCorrect = option === correctAnswer;

          return (
            <div key={option} className="flex flex-col items-center flex-1 h-full justify-end">
              {/* Value label */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-mono font-bold text-slate-300 mb-1"
              >
                {percent}%
              </motion.span>

              {/* Bar */}
              <div className="w-full bg-slate-800 rounded-t-md overflow-hidden h-28 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${percent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full rounded-t-sm ${
                    isCorrect
                      ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20"
                      : "bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/10"
                  }`}
                />
              </div>

              {/* Option label */}
              <span
                className={`mt-2 px-2.5 py-0.5 rounded text-xs font-bold font-mono transition-all ${
                  isCorrect
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {option}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 text-center mt-4 italic">
        Zaldagilarning ko'pchiligi shu variantni ma'qul ko'rmoqda
      </p>
    </div>
  );
};
