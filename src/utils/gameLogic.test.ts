import { describe, it, expect } from 'vitest';
import { validateTurn, Colors } from './gameLogic';

describe('Genius Game Logic - validateTurn', () => {
  it('deve retornar isGameOver=true se o jogador errar o primeiro passo da sequência', () => {
    const systemSequence = [Colors.GREEN, Colors.YELLOW, Colors.RED];
    const playerSequence = [Colors.BLUE];

    const result = validateTurn(systemSequence, playerSequence);

    expect(result.isValid).toBe(false);
    expect(result.isGameOver).toBe(true);
    expect(result.isLevelComplete).toBe(false);
  });

  it('deve retornar isGameOver=true se o jogador errar no meio da sequência', () => {
    const systemSequence = [Colors.GREEN, Colors.YELLOW, Colors.RED];
    const playerSequence = [Colors.GREEN, Colors.BLUE]; // Errou no segundo passo

    const result = validateTurn(systemSequence, playerSequence);

    expect(result.isValid).toBe(false);
    expect(result.isGameOver).toBe(true);
    expect(result.isLevelComplete).toBe(false);
  });

  it('deve retornar isLevelComplete=true se o jogador acertar a sequência toda', () => {
    const systemSequence = [Colors.GREEN, Colors.YELLOW, Colors.RED];
    const playerSequence = [Colors.GREEN, Colors.YELLOW, Colors.RED];

    const result = validateTurn(systemSequence, playerSequence);

    expect(result.isValid).toBe(true);
    expect(result.isGameOver).toBe(false);
    expect(result.isLevelComplete).toBe(true);
  });

  it('deve retornar isValid=true e isLevelComplete=false se o jogador estiver no meio de um turno correto', () => {
    const systemSequence = [Colors.GREEN, Colors.YELLOW, Colors.RED, Colors.BLUE];
    const playerSequence = [Colors.GREEN, Colors.YELLOW];

    const result = validateTurn(systemSequence, playerSequence);

    expect(result.isValid).toBe(true);
    expect(result.isGameOver).toBe(false);
    expect(result.isLevelComplete).toBe(false);
  });
});
