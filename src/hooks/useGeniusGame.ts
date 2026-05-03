import { useState, useCallback, useRef, useEffect } from 'react';
import { Colors, validateTurn, getRandomColor, sleep } from '../utils/gameLogic';
import { audio } from '../utils/audio';

export type GameMode = 'casual' | 'competitive';

export function useGeniusGame() {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isPoweringOn, setIsPoweringOn] = useState(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('casual');
  const [isMuted, setIsMuted] = useState(true);
  
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [turn, setTurn] = useState(0);

  const [systemSequence, setSystemSequence] = useState<Colors[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Colors[]>([]);
  
  const [activeColor, setActiveColor] = useState<Colors | null>(null);
  const isPlayingRef = useRef(false);

  const toggleMute = useCallback(() => {
    setIsMuted(audio.toggleMute());
  }, []);

  const togglePower = useCallback(() => {
    setIsPowerOn(prev => {
      const next = !prev;
      if (!next) {
        setSystemSequence([]);
        setPlayerSequence([]);
        setScore(0);
        setDifficulty(1);
        setTurn(0);
        setGameOver(false);
        setIsVictory(false);
        setIsPlayingSequence(false);
        setActiveColor(null);
        setIsPoweringOn(false);
        isPlayingRef.current = false;
      } else {
        // Inicia a animação de ligar
        setIsPoweringOn(true);
        setTimeout(() => setIsPoweringOn(false), 1500);
      }
      return next;
    });
  }, []);

  const changeDifficulty = useCallback(() => {
    if (isPowerOn && !isPlayingSequence && systemSequence.length === 0 && !gameOver && !isVictory && !isPoweringOn) {
      setDifficulty(prev => (prev >= 4 ? 1 : prev + 1));
    }
  }, [isPowerOn, isPlayingSequence, systemSequence, gameOver, isVictory, isPoweringOn]);

  const toggleGameMode = useCallback(() => {
    if (isPowerOn && !isPlayingSequence && systemSequence.length === 0 && !gameOver && !isVictory && !isPoweringOn) {
      setGameMode(prev => prev === 'casual' ? 'competitive' : 'casual');
    }
  }, [isPowerOn, isPlayingSequence, systemSequence, gameOver, isVictory, isPoweringOn]);

  const playSequence = useCallback(async (sequence: Colors[], currentDiff: number) => {
    setIsPlayingSequence(true);
    isPlayingRef.current = true;
    
    await sleep(800);

    const baseSpeed = 900;
    const speedMultiplier = Math.max(0.3, 1 - (currentDiff * 0.15)); 
    const flashDuration = baseSpeed * speedMultiplier;
    const pauseDuration = flashDuration * 0.3;

    for (let i = 0; i < sequence.length; i++) {
      if (!isPlayingRef.current) break;
      
      setActiveColor(sequence[i]);
      audio.playTone(sequence[i], flashDuration);
      await sleep(flashDuration);
      
      setActiveColor(null);
      await sleep(pauseDuration);
    }

    if (isPlayingRef.current) {
      setIsPlayingSequence(false);
    }
  }, []);

  const startGame = useCallback(() => {
    if (!isPowerOn || isPoweringOn) return;
    
    setGameOver(false);
    setIsVictory(false);
    setScore(0);
    setTurn(1);
    setPlayerSequence([]);

    const firstColor = getRandomColor();
    const newSeq = [firstColor];
    setSystemSequence(newSeq);
    
    playSequence(newSeq, difficulty);
  }, [isPowerOn, isPoweringOn, difficulty, playSequence]);

  const restartGame = useCallback(() => {
    if (!isPowerOn || isPoweringOn) return;
    isPlayingRef.current = false; // Cancela a sequencia atual
    setIsPlayingSequence(false);
    setActiveColor(null);
    setTimeout(() => {
      startGame();
    }, 100);
  }, [isPowerOn, isPoweringOn, startGame]);

  const nextLevel = useCallback((currentSeq: Colors[]) => {
    const nextColor = getRandomColor();
    const newSeq = [...currentSeq, nextColor];
    
    setSystemSequence(newSeq);
    setPlayerSequence([]);
    
    playSequence(newSeq, difficulty);
  }, [difficulty, playSequence]);

  const handleColorClick = useCallback((color: Colors) => {
    if (!isPowerOn || isPoweringOn || isPlayingSequence || gameOver || isVictory || systemSequence.length === 0) return;

    setActiveColor(color);
    audio.playTone(color, 200);
    setTimeout(() => {
      setActiveColor(prev => prev === color ? null : prev);
    }, 200);

    const newPlayerSeq = [...playerSequence, color];
    setPlayerSequence(newPlayerSeq);

    const result = validateTurn(systemSequence, newPlayerSeq);

    if (result.isGameOver) {
      setGameOver(true);
      setSystemSequence([]);
      audio.playTone('error', 800);
    } else if (result.isLevelComplete) {
      const newScore = score + 1;
      setScore(newScore);
      setTurn(turn + 1);

      if (gameMode === 'competitive' && newScore >= 124) {
        setIsVictory(true);
        setSystemSequence([]);
        return;
      }

      setIsPlayingSequence(true);
      setTimeout(() => {
        nextLevel(systemSequence);
      }, 1000);
    }
  }, [isPowerOn, isPoweringOn, isPlayingSequence, gameOver, isVictory, systemSequence, playerSequence, score, turn, gameMode, nextLevel]);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
    };
  }, []);

  return {
    isPowerOn,
    isPoweringOn,
    isPlayingSequence,
    gameOver,
    isVictory,
    gameMode,
    isMuted,
    score,
    difficulty,
    turn,
    activeColor,
    togglePower,
    toggleMute,
    changeDifficulty,
    toggleGameMode,
    startGame,
    restartGame,
    handleColorClick,
  };
}
