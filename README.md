<div align="center">
  <img src="public/favicon.png" alt="Logo Sk8 Genius" width="120" height="120" />
  
  # Sk8-Genius | O Clássico Jogo de Memória 🎮
  
  **Uma experiência imersiva e eletrizante, traduzida em código de altíssima performance e engenharia sonora avançada.**

  **Stack Tecnológico**
  <br>
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

  **Metodologia & Habilidades**
  <br>
  [![Product Management](https://img.shields.io/badge/Product_Management-FF8C00?style=for-the-badge&logo=trello&logoColor=white)](#)
  [![Pair Programming](https://img.shields.io/badge/Pair_Programming-2E8B57?style=for-the-badge&logo=peertube&logoColor=white)](#)
  [![AI Assisted Dev](https://img.shields.io/badge/AI_Assisted_Dev-000000?style=for-the-badge&logo=openai&logoColor=white)](#)
  [![Prompt Engineering](https://img.shields.io/badge/Prompt_Engineering-7B68EE?style=for-the-badge&logo=probot&logoColor=white)](#)
</div>

<br />

## 🌐 Projeto Online

O jogo está em produção e pode ser jogado diretamente pelo navegador:

**👉 Jogue agora:** [Inserir Link da Hospedagem Aqui - ex: Vercel, Netlify, GitHub Pages]

---

## 📖 Visão Geral

Este projeto é uma **evolução massiva** de um clone do clássico "Simon Says" (Genius) concebido em 2022 usando Vanilla JS puro. O objetivo da refatoração atual foi levar o projeto de um simples "exercício lógico" a uma aplicação *Front-End* com **grau de produção impecável**, focando em mecânicas modernas de UI/UX, acessibilidade completa para Power Users e performance extrema.

A aplicação foi reescrita utilizando **React** tipado com **TypeScript** e estilizado com a potência e flexibilidade do **Tailwind CSS v4**, orquestrado pelo **Vite** para entregar um *bundle* ultraleve.

---

## 📸 Interface e Layout

### O Clássico em Alta Resolução (Desktop & Tablet)
| Jogo em Execução (Ligado) | Máquina em Espera (Desligada) |
| :---: | :---: |
| ![Desktop Ligado](public/printDesktopTabletLigado.jpg) | ![Desktop Desligado](public/printDesktopTabletDesligado.jpg) |

### Responsividade e Experiência Mobile
| Visão Mobile (Ligado) | Visão Mobile (Desligado) |
| :---: | :---: |
| ![Mobile Ligado](public/printMobileLigado.jpg) | ![Mobile Desligado](public/printMobileDesligado.jpg) |

### Modos Avançados e UI de Fim de Jogo
| Modo Competitivo (Aro de LED) | Tela de Game Over |
| :---: | :---: |
| ![Modo Competitivo](public/printCompetitivo.jpg) | ![Game Over](public/printGameOver.jpg) |

### Documentação Integrada e Modais
| Manual de Ajuda (Interativo) | Painel Sobre |
| :---: | :---: |
| ![Modal Ajuda](public/printModalAjuda.jpg) | ![Modal Sobre](public/printModalSobre.jpg) |

---

## 🚀 Atualizações e Melhorias Arquiteturais

O projeto saltou de nível em múltiplos pilares de Engenharia de Software e Design de Produto. Abaixo, o comparativo estrutural da refatoração:

| Pilar Técnico | Como Era (Vanilla JS - 2022) | Como Está Agora (React/TS - Atual) |
| :--- | :--- | :--- |
| 🏗️ **Arquitetura & Stack** | HTML/CSS isolados com forte acoplamento e manipulação direta do DOM. | Ecossistema React tipado. Lógica isolada no Custom Hook `useGeniusGame`, garantindo separação de responsabilidades. |
| 🎨 **Design (UI/UX)** | Estilização básica, estática e com responsividade rígida. | Tailwind CSS v4 com Design System moderno (*Glassmorphism*, *Drop-Shadows* de neon responsivos a 60 FPS). |
| 🎮 **Mecânicas de Jogo** | Fluxo estático de velocidade única e mecânica base. | 4 Níveis de *Skill* (de 0.8s a 0.4s), visores digitais de *Score* e Modo Competitivo (Aro como barra de progresso até 124 acertos). |
| 🔊 **Engenharia Sonora** | Arquivos `.mp3` convencionais, sujeitos a latência e delay de rede. | Sintetizador via **Web Audio API**. Frequências geradas em tempo real (latência zero) com política de áudio *Opt-in* (inicia mutado). |
| ⌨️ **Acessibilidade (A11y)** | Interação focada puramente em cliques do mouse. | Suporte total a teclado (*Power Users*). Teclas grafadas na UI, navegação completa por atalhos e Modal de Ajuda com motor de busca. |
| ⚡ **Performance & Seg.** | Sujeito a repinturas excessivas no DOM e ausência de headers de segurança. | *Memoization* (`React.memo`) garantindo bundle de **~79 KB**. Injeção de políticas **CSP** rígidas contra injeção de scripts/XSS. |

---

## 🛠️ Guia de Manutenção (Para futuros Devs)

A longevidade do código baseia-se na clareza modular. Para escalar ou modificar funcionalidades, siga as premissas abaixo:

1. **Alterando a Lógica de Jogo:**
   * Regras matemáticas puras, matriz de validação e geração de cores ficam em `src/utils/gameLogic.ts`.
   * Para alterar temporizações da velocidade, comportamento das fases, e pontuações do "Modo Competitivo", modifique exclusivamente o estado consolidado dentro do Hook central `src/hooks/useGeniusGame.ts`.
2. **Motor de Áudio:**
   * Todo o gerador de frequências mora no Singleton instanciado em `src/utils/audio.ts`. Se desejar alterar as notas musicais das lentes verde/vermelha/amarela/azul, modifique os hertz nativos deste arquivo.
3. **Gerenciamento de Renderização:**
   * Os painéis físicos do brinquedo não possuem regras de negócio e estão embrulhados em `React.memo` (`ColorPad` e `ControlPanel`). Se precisar injetar uma nova propriedade lá dentro, certifique-se de que a função foi gerada no Pai usando `useCallback` para evitar matar a otimização de repintura do Virtual DOM.

---

## 📬 Contato

Se você quiser discutir sobre a arquitetura deste projeto, engenharia de prompt ou desenvolvimento web, conecte-se comigo:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/carlos-lopes-b445aa201)
[![E-mail](https://img.shields.io/badge/E--mail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:[carloshcldev@gmail.com])
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/CHCLopes)

---

<div align="center">
  Desenvolvido por Carlos Sk8 Lopes. Elevando o padrão visual e mecânico de um clássico absoluto da nossa infância! 🛹🧠
</div>