export const Colors = {
  GREEN: 0,
  RED: 1,
  YELLOW: 2,
  BLUE: 3,
} as const;

export type Colors = typeof Colors[keyof typeof Colors];

export type ValidationResult = {
  isValid: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
};

/**
 * Valida a jogada do usuário em comparação com a sequência do sistema.
 * 
 * @param systemSequence A sequência gerada pelo sistema até o momento.
 * @param playerSequence A sequência clicada pelo jogador no turno atual.
 * @returns Um objeto indicando se a jogada foi válida, se o jogo acabou ou se o nível foi concluído.
 */
export function validateTurn(systemSequence: Colors[], playerSequence: Colors[]): ValidationResult {
  // O jogador não clicou em nada ainda ou sequências vazias
  if (playerSequence.length === 0 || systemSequence.length === 0) {
    return { isValid: true, isGameOver: false, isLevelComplete: false };
  }

  // Verifica passo a passo da sequência do jogador
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== systemSequence[i]) {
      return { isValid: false, isGameOver: true, isLevelComplete: false };
    }
  }

  // Se chegou aqui, todos os cliques até o momento estão corretos.
  // Verifica se o jogador terminou a sequência inteira do sistema
  if (playerSequence.length === systemSequence.length) {
    return { isValid: true, isGameOver: false, isLevelComplete: true };
  }

  // Acertou os passos, mas ainda não terminou a sequência do turno
  return { isValid: true, isGameOver: false, isLevelComplete: false };
}

/**
 * Gera uma nova cor aleatória (0 a 3)
 */
export function getRandomColor(): Colors {
  return Math.floor(Math.random() * 4) as Colors;
}

/**
 * Utilitário para pausar a execução por N milissegundos
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
