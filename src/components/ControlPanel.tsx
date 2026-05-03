import React from 'react';
import { cn } from '../utils/cn';
import { Power, Play, Signal, RotateCcw, Trophy, Gamepad2 } from 'lucide-react';
import type { GameMode } from '../hooks/useGeniusGame';
import type { PhaseInfo } from './GameBoard';

interface ControlPanelProps {
  isPowerOn: boolean;
  score: number;
  difficulty: number;
  gameOver: boolean;
  isVictory: boolean;
  gameMode: GameMode;
  phaseInfo: PhaseInfo;
  onTogglePower: () => void;
  onStartGame: () => void;
  onRestartGame: () => void;
  onChangeDifficulty: () => void;
  onToggleGameMode: () => void;
}

export const ControlPanel = React.memo<ControlPanelProps>(({
  isPowerOn,
  score,
  difficulty,
  gameOver,
  isVictory,
  gameMode,
  phaseInfo,
  onTogglePower,
  onStartGame,
  onRestartGame,
  onChangeDifficulty,
  onToggleGameMode,
}) => {
  return (
    <div className={cn(
      "w-56 h-56 sm:w-64 sm:h-64 bg-slate-900 rounded-full border-8 border-slate-950 flex flex-col items-center justify-center z-20 shadow-2xl overflow-visible pointer-events-none",
      "transition-all duration-[1500ms] ease-in-out relative",
      isPowerOn ? "scale-100" : "scale-[1.4] sm:scale-[1.6]"
    )}>
      
      {/* SVG Progress Ring (Inner Ring) */}
      <svg 
        className={cn(
          "absolute z-0 pointer-events-none transition-opacity duration-500",
          (phaseInfo.show && isPowerOn) ? "opacity-100" : "opacity-0"
        )}
        style={{
          top: '-8px', left: '-8px', width: 'calc(100% + 16px)', height: 'calc(100% + 16px)',
          transform: 'rotate(-90deg)', 
          overflow: 'visible'
        }}
        viewBox="0 0 400 400"
      >
        <circle
          cx="200" cy="200" r="192"
          fill="none"
          stroke={phaseInfo.color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="1206"
          strokeDashoffset={isPowerOn ? (1206 - (1206 * (phaseInfo.progress / phaseInfo.max))) : 1206}
          className="transition-all duration-700 ease-in-out"
          style={{ 
            filter: isPowerOn ? `drop-shadow(0 0 10px ${phaseInfo.color})` : 'none'
          }}
        />
      </svg>

      {/* Container interno para afastar das bordas circulares */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 pt-4 pb-2 pointer-events-auto">
        <div className="mb-2 sm:mb-3 text-center">
          <h1 className={cn(
            "text-xl sm:text-2xl font-black tracking-widest transition-colors duration-500",
            isPowerOn ? "text-slate-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-slate-700"
          )}>
            GENIUS
          </h1>
        </div>

        {/* Floating +1 Feedback */}
        {score > 0 && isPowerOn && !gameOver && !isVictory && (
          <div key={`score-float-${score}`} className="absolute top-12 left-1/2 -translate-x-1/2 text-green-400 font-black text-xl drop-shadow-[0_0_8px_rgba(74,222,128,1)] animate-float-up pointer-events-none z-50">
            +1
          </div>
        )}

        {/* Displays */}
        <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-12 h-7 sm:w-14 sm:h-8 bg-black rounded border-2 border-slate-800 flex items-center justify-center font-mono text-base sm:text-lg",
              isPowerOn ? "text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,1)]" : "text-slate-800"
            )}>
              {isPowerOn ? score.toString().padStart(2, '0') : '--'}
            </div>
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Score</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-12 h-7 sm:w-14 sm:h-8 bg-black rounded border-2 border-slate-800 flex items-center justify-center font-mono text-base sm:text-lg",
              isPowerOn ? "text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,1)]" : "text-slate-800"
            )}>
              {isPowerOn ? difficulty : '-'}
            </div>
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Skill</span>
          </div>
        </div>

        {/* Botões de Controle */}
        <div className="flex gap-3 flex-wrap justify-center max-w-[180px]">
          
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onStartGame}
              disabled={!isPowerOn}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer",
                isPowerOn ? "bg-red-600 hover:bg-red-500 shadow-md" : "bg-red-900 opacity-50 cursor-not-allowed shadow-sm"
              )}
            >
              <Play size={12} className={isPowerOn ? "text-white" : "text-red-400"} />
            </button>
            <span className="text-[7px] sm:text-[8px] text-slate-500 font-bold mt-1 uppercase text-center leading-none">Start<br/>[Enter]</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onRestartGame}
              disabled={!isPowerOn}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer",
                isPowerOn ? "bg-blue-600 hover:bg-blue-500 shadow-md" : "bg-blue-900 opacity-50 cursor-not-allowed shadow-sm"
              )}
            >
              <RotateCcw size={12} className={isPowerOn ? "text-white" : "text-blue-400"} />
            </button>
            <span className="text-[7px] sm:text-[8px] text-slate-500 font-bold mt-1 uppercase text-center leading-none">Restart<br/>[R]</span>
          </div>

          {/* Mode Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onToggleGameMode}
              disabled={!isPowerOn}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer",
                isPowerOn ? "bg-purple-600 hover:bg-purple-500 shadow-md" : "bg-purple-900 opacity-50 cursor-not-allowed shadow-sm"
              )}
            >
              {gameMode === 'competitive' ? <Trophy size={12} className={isPowerOn ? "text-white" : "text-purple-400"} /> : <Gamepad2 size={12} className={isPowerOn ? "text-white" : "text-purple-400"} />}
            </button>
            <span className="text-[7px] sm:text-[8px] text-slate-500 font-bold mt-1 uppercase text-center leading-none">Mode<br/>[M]</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onChangeDifficulty}
              disabled={!isPowerOn}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer",
                isPowerOn ? "bg-yellow-500 hover:bg-yellow-400 shadow-md" : "bg-yellow-900 opacity-50 cursor-not-allowed shadow-sm"
              )}
            >
              <Signal size={12} className={isPowerOn ? "text-white" : "text-yellow-700"} />
            </button>
            <span className="text-[7px] sm:text-[8px] text-slate-500 font-bold mt-1 uppercase text-center leading-none">Skill<br/>[L]</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onTogglePower}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer",
                isPowerOn ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.7)] animate-pulse"
              )}
            >
              <Power size={12} className={isPowerOn ? "text-white drop-shadow-[0_0_2px_rgba(255,255,255,1)]" : "text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"} />
            </button>
            <span className={cn(
              "text-[7px] sm:text-[8px] font-bold mt-1 uppercase text-center leading-none",
              isPowerOn ? "text-slate-500" : "text-red-500 animate-pulse"
            )}>Power<br/>[P]</span>
          </div>
        </div>
      </div>

      {(gameOver || isVictory) && (
        <div className="absolute inset-0 rounded-full bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 z-30 px-4 text-center pointer-events-auto">
          {isVictory ? (
            <>
              <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)] animate-pulse">PARABÉNS!</h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2">Você terminou o jogo!</p>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse">GAME OVER</h2>
              {gameMode === 'competitive' ? (
                <p className="text-slate-300 text-[10px] sm:text-xs mt-2 leading-relaxed">Parabéns, você conseguiu {score} acertos.<br/>O recorde mundial é de 84 acertos.<br/>Você consegue superar?</p>
              ) : (
                <p className="text-slate-300 text-xs sm:text-sm mt-2">Score: {score}</p>
              )}
            </>
          )}
          <div className="flex flex-col gap-2 mt-3 w-full max-w-[140px]">
            <button onClick={onRestartGame} className={cn(
              "px-3 py-1.5 text-[10px] sm:text-xs font-bold border rounded transition-colors cursor-pointer w-full leading-tight",
              isVictory ? "border-white text-white hover:bg-white hover:text-slate-900" : "border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            )}>
              Jogar Novamente<br/>[Enter]
            </button>
            <button onClick={onTogglePower} className={cn(
              "px-3 py-1.5 text-[10px] sm:text-xs font-bold border rounded transition-colors cursor-pointer w-full leading-tight",
              isVictory ? "border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-slate-900" : "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            )}>
              Sair [Esc]
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
