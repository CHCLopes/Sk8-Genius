import { useState } from 'react';
import { GameBoard } from './components/GameBoard';

function App() {
  const [hasEnteredGame, setHasEnteredGame] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.3)_0%,rgba(2,6,23,1)_70%)]" />

      {/* Tela de Instruções (Modal Inicial) */}
      {!hasEnteredGame && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md transition-opacity duration-500">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-blue-500 mb-6">
              SK8 GENIUS
            </h1>
            
            <div className="text-slate-300 text-sm space-y-4 mb-8 text-left">
              <p>Bem-vindo ao Genius clássico! O objetivo é repetir a sequência de cores gerada pela máquina.</p>
              <ul className="list-disc list-inside space-y-2 text-slate-400">
                <li>Ligue o aparelho clicando no botão <b>Power</b>.</li>
                <li>Selecione a dificuldade com o botão <b>Skill</b>.</li>
                <li>Aperte <b>Start</b> para começar.</li>
                <li>Aguarde o robô mostrar as cores e repita na mesma ordem.</li>
              </ul>
            </div>

            <button
              onClick={() => setHasEnteredGame(true)}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all active:scale-95 cursor-pointer"
            >
              VAMOS JOGAR!
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center gap-4 px-2 sm:px-4 py-8">
        
        <GameBoard />

        <div className="mt-4 text-slate-500 text-xs sm:text-sm flex gap-4">
          <p>Powered by React & Tailwind V4</p>
          <span>•</span>
          <p>Vibe Coding</p>
        </div>
      </main>

    </div>
  );
}

export default App;
