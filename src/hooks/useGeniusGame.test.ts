import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGeniusGame } from './useGeniusGame';
import * as gameLogic from '../utils/gameLogic';
import { Colors } from '../utils/gameLogic';

// Mock do motor de áudio para evitar erros de AudioContext no jsdom
vi.mock('../utils/audio', () => ({
  audio: {
    playTone: vi.fn(),
    toggleMute: vi.fn().mockReturnValue(false),
  }
}));

describe('useGeniusGame Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Força o sistema a sempre escolher a cor GREEN para tornar os testes previsíveis
    vi.spyOn(gameLogic, 'getRandomColor').mockReturnValue(Colors.GREEN);
    // Mock do sleep para evitar lidar com Promise queues complexas nos testes
    vi.spyOn(gameLogic, 'sleep').mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('deve inicializar com o estado padrão (desligado e score 0)', () => {
    const { result } = renderHook(() => useGeniusGame());
    
    expect(result.current.isPowerOn).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.difficulty).toBe(1);
    expect(result.current.gameMode).toBe('casual');
  });

  it('deve processar uma rodada de SUCESSO corretamente', async () => {
    const { result } = renderHook(() => useGeniusGame());

    // Ligar a máquina
    act(() => {
      result.current.togglePower();
    });
    
    // Avança o tempo da animação de ligar (1500ms)
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.isPowerOn).toBe(true);

    // Iniciar o jogo
    await act(async () => {
      result.current.startGame();
      // Resolve promessas pendentes do sleep mockado
      await Promise.resolve();
    });

    expect(result.current.score).toBe(0);

    // Jogador clica na cor correta (GREEN, conforme mockado)
    await act(async () => {
      result.current.handleColorClick(Colors.GREEN);
    });

    // Avança o timeout de 1000ms antes do próximo nível (nextLevel)
    await act(async () => {
      vi.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(result.current.score).toBe(1);
    expect(result.current.gameOver).toBe(false);
  });

  it('deve processar uma rodada de FALHA corretamente (gameOver)', async () => {
    const { result } = renderHook(() => useGeniusGame());

    // Ligar a máquina
    act(() => {
      result.current.togglePower();
    });
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Iniciar o jogo
    await act(async () => {
      result.current.startGame();
      await Promise.resolve();
    });

    // Jogador clica na cor ERRADA (RED ao invés de GREEN)
    act(() => {
      result.current.handleColorClick(Colors.RED);
    });

    expect(result.current.gameOver).toBe(true);
    expect(result.current.score).toBe(0);
  });
});
