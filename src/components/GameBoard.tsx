import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { ColorPad } from './ColorPad';
import { ControlPanel } from './ControlPanel';
import { Colors } from '../utils/gameLogic';
import { useGeniusGame } from '../hooks/useGeniusGame';
import type { GameMode } from '../hooks/useGeniusGame';
import { HelpCircle, Info, X, Search, Mail, Power, Play, Signal, RotateCcw, Trophy, Volume2, VolumeX, Gamepad2, Keyboard, Circle } from 'lucide-react';

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.34 6.52-1.54 6.52-7.04 0-1.53-.54-2.73-1.42-3.7.14-.33.61-1.75-.14-3.65 0 0-1.15-.37-3.75 1.4a12.98 12.98 0 0 0-6.8 0c-2.6-1.77-3.75-1.4-3.75-1.4-.75 1.9-.28 3.32-.14 3.65-.88.97-1.42 2.17-1.42 3.7 0 5.5 3.34 6.7 6.52 7.04A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export type PhaseInfo = { color: string, progress: number, max: number, show: boolean };

function getPhaseInfo(score: number, gameMode: GameMode): PhaseInfo {
  if (gameMode === 'casual') return { color: '#ffffff', progress: 0, max: 100, show: false };
  if (score === 0) return { color: '#22c55e', progress: 0, max: 4, show: true };
  if (score <= 4) return { color: '#22c55e', progress: score, max: 4, show: true };
  if (score <= 12) return { color: '#ef4444', progress: score - 4, max: 8, show: true };
  if (score <= 28) return { color: '#3b82f6', progress: score - 12, max: 16, show: true };
  if (score <= 60) return { color: '#eab308', progress: score - 28, max: 32, show: true };
  return { color: '#ffffff', progress: score - 60, max: 64, show: true };
}

type HelpSection = { title: string; icon?: React.ReactNode; content: React.ReactNode; searchText: string };

const helpSections: HelpSection[] = [
  { 
    title: 'Objetivo', 
    icon: <HelpCircle size={14} className="text-blue-500" />,
    content: 'Teste e treine sua memória! O jogo gera uma sequência de luzes e sons. A cada rodada, um novo passo é adicionado. Repita a sequência para avançar e tente alcançar a maior pontuação possível.',
    searchText: 'objetivo jogo memoria sequencia luzes sons avancar pontuacao'
  },
  { 
    title: 'Como Jogar', 
    icon: <Play size={14} className="text-blue-500" />,
    content: '1. Ligue o aparelho no botão Power.\n2. Escolha a dificuldade (Skill) e o modo de jogo (Mode).\n3. Aperte Start.\n4. Aguarde a máquina terminar de piscar e tocar.\n5. Repita a sequência clicando nos botões ou usando o teclado.',
    searchText: 'como jogar passo a passo tutorial iniciar regras'
  },
  { 
    title: 'Botão Som (Volume)', 
    icon: <div className="bg-slate-700 text-white p-1 rounded-full shadow-sm"><Volume2 size={12} /></div>,
    content: 'Ativa ou desativa os efeitos sonoros do jogo. Por padrão, ele vem desativado. Você pode acioná-lo a qualquer momento, mesmo durante a partida.',
    searchText: 'som volume mudo mutar ativar desativar efeitos sonoros barulho'
  },
  { 
    title: 'Botão Mode', 
    icon: <div className="bg-purple-600 text-white p-1 rounded-full shadow-sm"><Trophy size={12} /></div>,
    content: 'Alterna entre os modos de jogo (Casual e Competitivo). Só pode ser alterado antes da partida iniciar.',
    searchText: 'mode botão modo casual competitivo trocar'
  },
  { 
    title: 'Badge de Modo', 
    icon: <div className="text-[9px] font-bold tracking-widest uppercase text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full flex items-center shadow-sm">Mode: <span className="text-blue-400 ml-1">casual</span></div>,
    content: 'Mostra visualmente qual modo de jogo está selecionado no momento. Fica localizada logo acima do botão de Som na coluna lateral.',
    searchText: 'badge indicador modo painel mostrar atual'
  },
  { 
    title: 'Modo Casual', 
    icon: <div className="bg-blue-600 text-white p-1 rounded-full shadow-sm"><Gamepad2 size={12} /></div>,
    content: 'Jogue da forma clássica. Errar uma cor encerra o jogo imediatamente e mostra sua pontuação final.',
    searchText: 'modo casual padrao jogo livre infinito'
  },
  { 
    title: 'Modo Competitivo', 
    icon: <div className="bg-purple-600 text-white p-1 rounded-full shadow-sm"><Trophy size={12} /></div>,
    content: 'Um modo avançado! Use o aro de LED em volta do painel para acompanhar seu progresso. São 5 fases (Verde, Vermelho, Azul, Amarelo e Branco). Tente bater os 124 acertos para zerar o jogo!',
    searchText: 'modo competitivo aro led fases vencer 124 recorde mundial'
  },
  { 
    title: 'Indicador de Pontuação (Score)', 
    icon: <div className="font-mono text-[10px] font-bold px-1.5 rounded bg-black border border-amber-900/50 text-amber-500 shadow-sm">042</div>,
    content: 'O visor digital esquerdo no painel central exibe sua pontuação atual. Cada cor reproduzida corretamente em uma sequência soma 1 ponto.',
    searchText: 'visor tela digital pontuacao pontos score placar indicador'
  },
  { 
    title: 'Indicador de Skill (Velocidade)', 
    icon: <div className="font-mono text-[10px] font-bold px-2 rounded bg-black border border-cyan-900/50 text-cyan-500 shadow-sm">2</div>,
    content: 'O visor digital direito no painel central exibe o nível de velocidade atual da máquina (de 1 a 4). Altere pressionando o botão "Skill".',
    searchText: 'visor tela digital velocidade skill dificuldade indicador nivel'
  },
  { 
    title: 'Aro de LED (Barra de Progresso)', 
    icon: <Circle size={14} className="text-purple-400" />,
    content: (
      <div className="flex flex-col gap-2">
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">No Modo Competitivo, o aro ao redor do painel central se transforma em uma barra de progresso que avança e muda de cor conforme suas vitórias:</p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-1 rounded bg-green-500 shadow-[0_0_5px_#22c55e]"></div> Fase 1 (1 a 4 acertos)</li>
          <li className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-1 rounded bg-red-500 shadow-[0_0_5px_#ef4444]"></div> Fase 2 (5 a 12 acertos)</li>
          <li className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-1 rounded bg-blue-500 shadow-[0_0_5px_#3b82f6]"></div> Fase 3 (13 a 28 acertos)</li>
          <li className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-1 rounded bg-yellow-500 shadow-[0_0_5px_#eab308]"></div> Fase 4 (29 a 60 acertos)</li>
          <li className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-1 rounded bg-white shadow-[0_0_5px_#ffffff]"></div> Fase Final (61 a 124 acertos)</li>
        </ul>
      </div>
    ),
    searchText: 'barra progresso aro led verde vermelho azul amarelo branco cores fases'
  },
  { 
    title: 'Botão Power', 
    icon: <div className="bg-green-600 text-white p-1 rounded-full shadow-sm"><Power size={12} /></div>,
    content: 'Liga ou desliga o aparelho. Reinicia completamente qualquer progresso, recorde ou configuração atual.',
    searchText: 'power botão ligar desligar aparelho reiniciar'
  },
  { 
    title: 'Botão Start', 
    icon: <div className="bg-red-600 text-white p-1 rounded-full shadow-sm"><Play size={12} /></div>,
    content: 'Inicia uma nova partida, mandando a máquina gerar a primeira cor da sequência.',
    searchText: 'start botão iniciar começar play nova partida'
  },
  { 
    title: 'Botão Restart', 
    icon: <div className="bg-blue-600 text-white p-1 rounded-full shadow-sm"><RotateCcw size={12} /></div>,
    content: 'Abandona a partida em andamento e inicia uma nova partida imediatamente, mantendo a dificuldade selecionada.',
    searchText: 'restart botão reiniciar tentar novamente resetar'
  },
  { 
    title: 'Botão Skill (Velocidade)', 
    icon: <div className="bg-yellow-500 text-white p-1 rounded-full shadow-sm"><Signal size={12} /></div>,
    content: 'Controla a velocidade em que a máquina pisca as luzes e toca os sons. Funciona em um ciclo de 4 níveis (1 a 4). O Nível 1 é o mais lento (~0.8 segundos por cor), enquanto o Nível 4 é extremamente rápido (~0.4 segundos). IMPORTANTE: A velocidade só pode ser alterada ANTES de iniciar a partida.',
    searchText: 'skill botão velocidade nivel dificuldade rapido devagar tempo'
  },
  { 
    title: 'Botões de Cores (Lentes)', 
    icon: (
      <div className="flex gap-1 bg-slate-950 p-1 rounded-full shadow-inner border border-slate-800">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
      </div>
    ),
    content: 'As 4 lentes coloridas (Verde, Vermelho, Amarelo, Azul). Após a máquina tocar sua sequência, pressione-as exatamente na mesma ordem.',
    searchText: 'cores botões lentes verde vermelho amarelo azul jogar apertar'
  },
  { 
    title: 'Botão Jogar Novamente', 
    icon: <div className="px-2 py-0.5 text-[9px] font-bold border border-green-500 text-green-400 rounded bg-slate-950">Jogar Novamente</div>,
    content: 'Aparece na tela de Fim de Jogo. Pressione para limpar o placar e tentar mais uma vez instantaneamente.',
    searchText: 'jogar de novo tentar try again tela fim de jogo jogar novamente'
  },
  { 
    title: 'Botão Sair', 
    icon: <div className="px-2 py-0.5 text-[9px] font-bold border border-red-500 text-red-400 rounded bg-slate-950">Sair</div>,
    content: 'Aparece na tela de Fim de Jogo. Pressione para desligar a máquina completamente (o mesmo que apertar Power ou a tecla Esc).',
    searchText: 'sair fechar desligar tela fim de jogo power'
  },
  { 
    title: 'Botão Ajuda', 
    icon: <div className="bg-blue-600 text-white p-1 rounded-full shadow-sm"><HelpCircle size={12} /></div>,
    content: 'Abre este modal de manual e ajuda para tirar dúvidas.',
    searchText: 'ajuda manual abrir consultar duvidas'
  },
  { 
    title: 'Botão Sobre', 
    icon: <div className="bg-emerald-600 text-white p-1 rounded-full shadow-sm"><Info size={12} /></div>,
    content: 'Abre o painel informando quem desenvolveu o jogo, versão atual e redes sociais.',
    searchText: 'sobre dev desenvolvedor versão creditos'
  },
  { 
    title: 'Atalhos de Teclado', 
    icon: <Keyboard size={14} className="text-slate-400" />,
    content: (
      <ul className="space-y-2 mt-2">
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-green-400 min-w-[1.2rem]">Q:</strong> Botão Verde (Sup. Esquerdo)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-red-400 min-w-[1.2rem]">W:</strong> Botão Vermelho (Sup. Direito)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-yellow-400 min-w-[1.2rem]">A:</strong> Botão Amarelo (Inf. Esquerdo)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-blue-400 min-w-[1.2rem]">S:</strong> Botão Azul (Inf. Direito)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[1.2rem]">P:</strong> Ligar/Desligar (Power)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[1.2rem]">L:</strong> Alterar Velocidade (Skill)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[2.5rem]">Enter:</strong> Iniciar partida (Start)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[1.2rem]">R:</strong> Reiniciar partida (Restart)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[1.2rem]">M:</strong> Alternar Modo de Jogo</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[1.2rem]">V:</strong> Ativar/Desativar Som (Volume)</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[1.2rem]">H:</strong> Abrir/Fechar Ajuda</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[1.2rem]">I:</strong> Abrir/Fechar Sobre</li>
        <li className="text-slate-300 text-sm bg-slate-950/50 p-2 rounded flex items-center gap-2"><strong className="text-white min-w-[2.5rem]">Esc:</strong> Sair (Desligar) do Game Over</li>
      </ul>
    ),
    searchText: 'teclado atalhos comandos q w a s cores verde vermelho amarelo azul v mute som mudo p power enter start r restart m modo h ajuda i sobre esc'
  }
];

export const GameBoard: React.FC = () => {
  const {
    isPowerOn,
    isPoweringOn,
    gameOver,
    isVictory,
    gameMode,
    isMuted,
    score,
    difficulty,
    activeColor,
    togglePower,
    toggleMute,
    changeDifficulty,
    toggleGameMode,
    startGame,
    restartGame,
    handleColorClick,
  } = useGeniusGame();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const phaseInfo = getPhaseInfo(score, gameMode);

  const filteredSections = helpSections.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.searchText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      
      const key = e.key.toLowerCase();
      
      if (isHelpOpen || isAboutOpen) {
        if (key === 'escape' || key === 'h' || key === 'i') {
          setIsHelpOpen(false);
          setIsAboutOpen(false);
        }
        return;
      }
      
      switch (key) {
        case 'q': handleColorClick(Colors.GREEN); break;
        case 'w': handleColorClick(Colors.RED); break;
        case 'a': handleColorClick(Colors.YELLOW); break;
        case 's': handleColorClick(Colors.BLUE); break;
        case 'm': toggleGameMode(); break;
        case 'v': toggleMute(); break;
        case 'l': changeDifficulty(); break;
        case 'p': togglePower(); break;
        case 'r': restartGame(); break;
        case 'enter': startGame(); break;
        case 'escape': if (gameOver || isVictory) togglePower(); break;
        case 'h': setIsHelpOpen(true); break;
        case 'i': setIsAboutOpen(true); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleColorClick, toggleMute, togglePower, restartGame, startGame, toggleGameMode, changeDifficulty, isHelpOpen, isAboutOpen, gameOver, isVictory]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-6xl mx-auto">
      
      {/* Left Column: Title & Action Badges */}
      <div className="flex flex-col items-center lg:items-start gap-4">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-700 animate-pulse text-center lg:text-left">
          SK8 GENIUS
        </h1>
        
        <div className="flex flex-col items-center lg:items-start gap-3 w-full max-w-[220px]">
          {/* Mode Badge */}
          <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-400 bg-slate-900/80 px-6 py-2 w-full justify-center lg:justify-start rounded-full border border-slate-800 shadow-md backdrop-blur-sm flex items-center gap-2">
            Mode [M]: <span className={gameMode === 'competitive' ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]' : 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]'}>{gameMode}</span>
          </div>
          
          {/* Mute Button */}
          <button 
            onClick={toggleMute} 
            className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 px-6 py-2 w-full rounded-full shadow-[0_0_10px_rgba(71,85,105,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            {isMuted ? <VolumeX size={16} className="text-red-400"/> : <Volume2 size={16} className="text-green-400"/>} 
            Som [V]: {isMuted ? 'Off' : 'On'}
          </button>

          {/* Ajuda Button */}
          <button 
            onClick={() => setIsHelpOpen(true)} 
            className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 hover:border-blue-400 px-6 py-2 w-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <HelpCircle size={16} /> Ajuda [H]
          </button>

          {/* Sobre Button */}
          <button 
            onClick={() => setIsAboutOpen(true)} 
            className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 hover:border-emerald-400 px-6 py-2 w-full rounded-full shadow-[0_0_10px_rgba(5,150,105,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <Info size={16} /> Sobre [I]
          </button>
        </div>
      </div>

      {/* Right Column: The Toy */}
      <div className="relative flex items-center justify-center w-full max-w-[480px] aspect-square rounded-full p-2 bg-slate-900 border-[10px] sm:border-[12px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)]">
        
        {/* Grid de Cores e Leds Amarelos */}
        <div className={cn(
          "absolute inset-3 sm:inset-5 rounded-full grid grid-cols-2 grid-rows-2 gap-2 sm:gap-4 p-2 sm:p-4 z-10",
          "border-[6px] border-slate-800 transition-all duration-[1500ms] ease-in-out",
          isPowerOn ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}>
          
          {/* SVG Outer Ring (Sempre amarelo quando ligado) */}
          <svg 
            className={cn(
              "absolute z-20 pointer-events-none transition-opacity duration-500",
              isPowerOn ? "opacity-100" : "opacity-0"
            )}
            style={{
              top: '-6px', left: '-6px', width: 'calc(100% + 12px)', height: 'calc(100% + 12px)',
              transform: 'rotate(-90deg)', 
              overflow: 'visible'
            }}
            viewBox="0 0 400 400"
          >
            <circle
              cx="200" cy="200" r="196"
              fill="none"
              stroke="#facc15"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="1232"
              strokeDashoffset={isPowerOn ? 0 : 1232}
              className="transition-all duration-[1500ms] ease-in-out"
              style={{ 
                filter: isPowerOn ? 'drop-shadow(0 0 10px rgba(250,204,21,1))' : 'none'
              }}
            />
          </svg>

          <ColorPad colorCode={Colors.GREEN} isActive={activeColor === Colors.GREEN || isPoweringOn} isPowerOn={isPowerOn} onClick={handleColorClick} className="rounded-tl-full" />
          <ColorPad colorCode={Colors.RED} isActive={activeColor === Colors.RED || isPoweringOn} isPowerOn={isPowerOn} onClick={handleColorClick} className="rounded-tr-full" />
          <ColorPad colorCode={Colors.YELLOW} isActive={activeColor === Colors.YELLOW || isPoweringOn} isPowerOn={isPowerOn} onClick={handleColorClick} className="rounded-bl-full" />
          <ColorPad colorCode={Colors.BLUE} isActive={activeColor === Colors.BLUE || isPoweringOn} isPowerOn={isPowerOn} onClick={handleColorClick} className="rounded-br-full" />
        </div>

        {/* Center Panel */}
        <ControlPanel
          isPowerOn={isPowerOn}
          score={score}
          difficulty={difficulty}
          gameOver={gameOver}
          isVictory={isVictory}
          gameMode={gameMode}
          phaseInfo={phaseInfo}
          onTogglePower={togglePower}
          onStartGame={startGame}
          onRestartGame={restartGame}
          onChangeDifficulty={changeDifficulty}
          onToggleGameMode={toggleGameMode}
        />
      </div>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-800 gap-4 relative">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><HelpCircle className="text-blue-500"/> Ajuda</h2>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/>
                <input 
                  type="text" 
                  placeholder="Pesquisar manual..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer absolute sm:static right-4 top-4"><X size={20}/></button>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto">
              <div className="flex flex-col gap-3">
                {filteredSections.length > 0 ? filteredSections.map((sec, i) => (
                  <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <h3 className="font-bold text-blue-400 text-sm mb-2 flex items-center gap-2">
                      {sec.icon && <span>{sec.icon}</span>}
                      {sec.title}
                    </h3>
                    {typeof sec.content === 'string' ? (
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{sec.content}</p>
                    ) : (
                      sec.content
                    )}
                  </div>
                )) : (
                  <p className="text-slate-500 text-center py-4 text-sm">Nenhum resultado encontrado para "{searchTerm}".</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Info className="text-emerald-500"/> Sobre o Jogo</h2>
              <button onClick={() => setIsAboutOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-700">SK8 GENIUS</h1>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded font-mono border border-slate-700">Versão 2.0.0</span>
              
              <div className="text-slate-400 text-sm mt-2 max-w-xs leading-relaxed">
                Criado por <strong className="text-slate-200">Carlos Sk8 Lopes</strong> em 2022 usando Vanilla JS, 
                e refatorado para <strong className="text-emerald-400">React, TypeScript e Tailwind V4</strong> com a ajuda de Inteligência Artificial em 2026.
              </div>

              <div className="flex flex-col w-full gap-2 mt-4">
                <a href="mailto:carloshcldev@gmail.com" className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2 rounded-lg transition-colors border border-red-500">
                  <Mail size={16}/> carloshcldev@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/carlos-lopes-b445aa201" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-bold py-2 rounded-lg transition-colors border border-[#0a66c2]">
                  <LinkedinIcon size={16}/> LinkedIn
                </a>
                <a href="https://github.com/CHCLopes" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors border border-slate-700">
                  <GithubIcon size={16}/> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
