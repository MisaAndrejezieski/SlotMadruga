/**
 * ========================================
 * JOGO DE SLOTS - DANDADAN
 * ========================================
 * Versão: 3.3 - SLOTS RODAM DE VERDADE + GIF FICA ATÉ O FINAL DA PRÓXIMA JOGADA
 * ========================================
 */

(function() {
  'use strict';

  // ========================================
  // CONSTANTES GLOBAIS
  // ========================================
  const CONFIG = {
    QUANTIDADE_SLOT: 9,
    APOSTA_FIXA: 10,
    CHANCE_VITORIA: 0.51,
    TEMPO_GIRO: 3000,           // 3 segundos de giro
    INTERVALO_GIRO: 50,         // Troca a cada 50ms (mais rápido = mais suave)
    CREDITOS_INICIAIS: 100,
    COMPRA_CREDITOS: 100
  };

  // ========================================
  // IMAGENS DOS SLOTS
  // ========================================
  const IMAGENS = [
    './images/a001.gif',
    './images/a002.gif',
    './images/a003.gif',
    './images/a004.gif',
    './images/a005.gif',
    './images/a006.gif',
    './images/a007.gif',
    './images/a008.gif',
    './images/a009.gif',
    './images/stella-cute.gif'
  ];

  // ========================================
  // MULTIPLICADORES
  // ========================================
  const MULTIPLICADORES = [
    0.5,  // a001.gif
    0.75, // a002.gif
    10,   // a003.gif
    2,    // a004.gif
    2.5,  // a005.gif
    3,    // a006.gif
    10,   // a007.gif
    4,    // a008.gif
    5,    // a009.gif
    1     // stella-cute.gif
  ];

  const PESOS = [
    0.3, 0.3, 0.05, 0.4, 0.4, 0.4, 0.05, 0.5, 0.5, 0.6
  ];

  // ========================================
  // GIFs DE FEEDBACK
  // ========================================
  const GIFS_FEEDBACK = {
    VITORIA_PREMIUM: './images/a010.gif',
    VITORIA_GRANDE: './images/a011.gif',
    VITORIA_MEDIA: './images/b003.gif',
    VITORIA_NORMAL: './images/b007.gif',
    DERROTA_FRUSTRANTE: './images/giphy004.gif',
    DERROTA_TRISTE: './images/giphy001.gif',
    DERROTA_NORMAL: './images/alice-hana.gif'
  };

  // ========================================
  // LINHAS VENCEDORAS
  // ========================================
  const LINHAS_VENCEDORAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // ========================================
  // ELEMENTOS DO DOM
  // ========================================
  const DOM = {
    divImagens: document.querySelector('.images'),
    divResultado: document.getElementById('results'),
    creditos: document.getElementById('creditos'),
    gifContainer: document.getElementById('gifContainer'),
    playButton: document.getElementById('playButton'),
    slots: document.querySelectorAll('.slots')
  };

  // ========================================
  // ESTADO DO JOGO
  // ========================================
  const Estado = {
    creditosValor: parseInt(DOM.creditos.value) || CONFIG.CREDITOS_INICIAIS,
    resultados: [],
    derrotasConsecutivas: parseInt(localStorage.getItem('derrotas') || '0'),
    rodando: false,
    gifAtual: null  // Guarda o GIF atual para manter até o final da próxima jogada
  };

  DOM.creditos.value = Estado.creditosValor;

  // ========================================
  // FUNÇÃO PARA LIMPAR GIF (APENAS NO FINAL DA PRÓXIMA JOGADA)
  // ========================================
  function limparGif() {
    if (DOM.gifContainer) {
      DOM.gifContainer.innerHTML = '';
      Estado.gifAtual = null;
    }
  }

  // ========================================
  // FUNÇÃO PRINCIPAL
  // ========================================
  window.multiplicador = function() {
    'use strict';

    if (Estado.rodando) return;

    // ====================================
    // SÓ LIMPA O GIF QUANDO A JOGADA TERMINAR (NÃO NO INÍCIO)
    // O GIF FICA EXIBIDO DURANTE TODO O GIRO
    // ====================================

    if (CONFIG.APOSTA_FIXA > Estado.creditosValor) {
      DOM.divResultado.textContent = '❌ Créditos insuficientes!';
      DOM.divResultado.className = 'lost';
      mostrarGif(GIFS_FEEDBACK.DERROTA_NORMAL);
      return;
    }

    Estado.rodando = true;
    DOM.playButton.disabled = true;
    DOM.playButton.textContent = '🔄 Girando...';

    Estado.creditosValor -= CONFIG.APOSTA_FIXA;
    DOM.creditos.value = Estado.creditosValor;

    DOM.divResultado.textContent = '🎰 Girando...';
    DOM.divResultado.className = '';

    // ====================================
    // APLICA A ANIMAÇÃO DE GIRO NOS SLOTS
    // ====================================
    DOM.slots.forEach(slot => {
      slot.classList.remove('ganhou');
      slot.classList.remove('rodando-suave');
      // Força reflow para reiniciar animação
      void slot.offsetWidth;
      slot.classList.add('rodando-suave');
    });

    // ====================================
    // GIRO CONTÍNUO TROCANDO IMAGENS
    // ====================================
    let contadorGiros = 0;
    const totalGiros = Math.floor(CONFIG.TEMPO_GIRO / CONFIG.INTERVALO_GIRO);

    const intervaloRodando = setInterval(() => {
      DOM.slots.forEach((slot) => {
        const aleatorio = Math.floor(Math.random() * IMAGENS.length);
        slot.src = IMAGENS[aleatorio];
      });
      contadorGiros++;

      // Quando chega perto do final, desacelera
      if (contadorGiros >= totalGiros - 10) {
        // Aumenta o intervalo gradualmente para dar efeito de freio
        clearInterval(intervaloRodando);
        
        let frameFinal = 0;
        const totalFramesFreio = 8;
        
        function giroFreio() {
          DOM.slots.forEach((slot) => {
            const aleatorio = Math.floor(Math.random() * IMAGENS.length);
            slot.src = IMAGENS[aleatorio];
          });
          frameFinal++;
          
          if (frameFinal < totalFramesFreio) {
            // Aumenta o delay progressivamente: 100ms, 120ms, 150ms, 200ms...
            const delay = 100 + (frameFinal * 25);
            setTimeout(giroFreio, delay);
          } else {
            // ====================================
            // FINALIZA O GIRO
            // ====================================
            DOM.slots.forEach(slot => {
              slot.classList.remove('rodando-suave');
            });

            definirResultadosComChanceDeGanho(CONFIG.CHANCE_VITORIA);

            setTimeout(() => {
              verifiqueSeGanhou();
              Estado.rodando = false;
              DOM.playButton.disabled = false;
              DOM.playButton.textContent = '🎰 Girar';
              
              // ====================================
              // SÓ LIMPA O GIF AGORA - NO FINAL DA JOGADA
              // ====================================
              limparGif();
            }, 400);
          }
        }
        
        giroFreio();
      }
    }, CONFIG.INTERVALO_GIRO);
  };

  // ========================================
  // FUNÇÕES AUXILIARES
  // ========================================

  function selecionarImagemComPeso() {
    const totalPesos = PESOS.reduce((a, b) => a + b, 0);
    const numeroAleatorio = Math.random() * totalPesos;
    let somaPesos = 0;

    for (let i = 0; i < PESOS.length; i++) {
      somaPesos += PESOS[i];
      if (numeroAleatorio < somaPesos) return i;
    }
    return PESOS.length - 1;
  }

  function definirResultadosComChanceDeGanho(chanceDeGanhar) {
    for (let i = 0; i < CONFIG.QUANTIDADE_SLOT; i++) {
      const aleatorio = selecionarImagemComPeso();
      const slotAtual = DOM.divImagens.querySelector(`.slot-${i + 1}`);
      if (slotAtual) {
        slotAtual.src = IMAGENS[aleatorio];
        Estado.resultados[i] = IMAGENS[aleatorio];
      }
    }

    let temVitoria = false;
    for (const linha of LINHAS_VENCEDORAS) {
      const [a, b, c] = linha;
      if (Estado.resultados[a] === Estado.resultados[b] &&
          Estado.resultados[a] === Estado.resultados[c]) {
        temVitoria = true;
        break;
      }
    }

    const deveGanhar = Math.random() < chanceDeGanhar;

    if (deveGanhar && !temVitoria) {
      forcarVitoria();
    } else if (!deveGanhar && temVitoria) {
      quebrarVitoria();
    }
  }

  function forcarVitoria() {
    const indicesPremium = [2, 6];
    const usaImagemPremium = Math.random() < 0.3;

    let idxImagem;
    if (usaImagemPremium) {
      idxImagem = indicesPremium[Math.floor(Math.random() * indicesPremium.length)];
    } else {
      const indicesBons = [0, 1, 3, 4, 5, 7, 8];
      idxImagem = indicesBons[Math.floor(Math.random() * indicesBons.length)];
    }

    const imagemVencedora = IMAGENS[idxImagem];
    const linhaEscolhida = LINHAS_VENCEDORAS[Math.floor(Math.random() * LINHAS_VENCEDORAS.length)];

    for (const posicao of linhaEscolhida) {
      const slotAtual = DOM.divImagens.querySelector(`.slot-${posicao + 1}`);
      if (slotAtual) {
        slotAtual.src = imagemVencedora;
        Estado.resultados[posicao] = imagemVencedora;
      }
    }

    const posicoesRestantes = [];
    for (let i = 0; i < CONFIG.QUANTIDADE_SLOT; i++) {
      if (!linhaEscolhida.includes(i)) {
        posicoesRestantes.push(i);
      }
    }

    for (const posicao of posicoesRestantes) {
      let novaImagem;
      let tentativas = 0;
      do {
        const idx = selecionarImagemComPeso();
        novaImagem = IMAGENS[idx];
        tentativas++;
      } while (tentativas < 30 && criariaLinhaVencedora(posicao, novaImagem, linhaEscolhida));

      const slotAtual = DOM.divImagens.querySelector(`.slot-${posicao + 1}`);
      if (slotAtual) {
        slotAtual.src = novaImagem;
        Estado.resultados[posicao] = novaImagem;
      }
    }
  }

  function quebrarVitoria() {
    const linhasAtuais = [];
    for (const linha of LINHAS_VENCEDORAS) {
      const [a, b, c] = linha;
      if (Estado.resultados[a] === Estado.resultados[b] &&
          Estado.resultados[a] === Estado.resultados[c]) {
        linhasAtuais.push(linha);
      }
    }

    for (const linha of linhasAtuais) {
      const posicaoParaTrocar = linha[Math.floor(Math.random() * linha.length)];
      let novaImagem;
      let tentativas = 0;
      do {
        const idx = selecionarImagemComPeso();
        novaImagem = IMAGENS[idx];
        tentativas++;
      } while (tentativas < 30 && novaImagem === Estado.resultados[posicaoParaTrocar]);

      const slotAtual = DOM.divImagens.querySelector(`.slot-${posicaoParaTrocar + 1}`);
      if (slotAtual) {
        slotAtual.src = novaImagem;
        Estado.resultados[posicaoParaTrocar] = novaImagem;
      }
    }
  }

  function criariaLinhaVencedora(posicao, imagem, linhaIgnorar) {
    for (const linha of LINHAS_VENCEDORAS) {
      if (linha === linhaIgnorar) continue;
      if (!linha.includes(posicao)) continue;

      const valores = linha.map(i => i === posicao ? imagem : Estado.resultados[i]);
      if (valores[0] === valores[1] && valores[0] === valores[2]) {
        return true;
      }
    }
    return false;
  }

  function verifiqueSeGanhou() {
    let ganhoTotal = 0;
    let ganhou = false;
    const slotsGanhadores = new Set();
    let imagemVencedora = '';
    let multiplicadorUsado = 0;

    for (const linha of LINHAS_VENCEDORAS) {
      const [a, b, c] = linha;
      if (Estado.resultados[a] && 
          Estado.resultados[a] === Estado.resultados[b] &&
          Estado.resultados[a] === Estado.resultados[c]) {
        const indiceImagem = IMAGENS.indexOf(Estado.resultados[a]);
        const mult = MULTIPLICADORES[indiceImagem];
        ganhoTotal += CONFIG.APOSTA_FIXA * mult;
        ganhou = true;
        imagemVencedora = Estado.resultados[a];
        multiplicadorUsado = mult;
        linha.forEach(i => slotsGanhadores.add(i));
      }
    }

    if (ganhou) {
      Estado.creditosValor += ganhoTotal;
      DOM.creditos.value = Estado.creditosValor;

      const nomeArquivo = imagemVencedora.split('/').pop();
      DOM.divResultado.textContent = `🎉 Ganhou ${ganhoTotal} créditos! (${nomeArquivo} x${multiplicadorUsado})`;
      DOM.divResultado.className = 'won';
      Estado.derrotasConsecutivas = 0;

      slotsGanhadores.forEach(i => {
        const slot = DOM.divImagens.querySelector(`.slot-${i + 1}`);
        if (slot) {
          slot.classList.add('ganhou');
        }
      });

      // MOSTRA O GIF DE VITÓRIA - FICA ATÉ O FINAL DA PRÓXIMA JOGADA
      if (multiplicadorUsado >= 10) {
        mostrarGif(GIFS_FEEDBACK.VITORIA_PREMIUM);
      } else if (multiplicadorUsado >= 5) {
        mostrarGif(GIFS_FEEDBACK.VITORIA_GRANDE);
      } else if (multiplicadorUsado >= 3) {
        mostrarGif(GIFS_FEEDBACK.VITORIA_MEDIA);
      } else {
        mostrarGif(GIFS_FEEDBACK.VITORIA_NORMAL);
      }

    } else {
      DOM.divResultado.textContent = '😢 Mais sorte na próxima vez!';
      DOM.divResultado.className = 'lost';
      Estado.derrotasConsecutivas++;

      // MOSTRA O GIF DE DERROTA - FICA ATÉ O FINAL DA PRÓXIMA JOGADA
      if (Estado.derrotasConsecutivas >= 10) {
        mostrarGif(GIFS_FEEDBACK.DERROTA_FRUSTRANTE);
        Estado.derrotasConsecutivas = 0;
      } else if (Estado.derrotasConsecutivas >= 5) {
        mostrarGif(GIFS_FEEDBACK.DERROTA_TRISTE);
      } else {
        mostrarGif(GIFS_FEEDBACK.DERROTA_NORMAL);
      }
    }

    localStorage.setItem('derrotas', Estado.derrotasConsecutivas);
  }

  // ========================================
  // MOSTRA GIF - FICA ATÉ O FINAL DA PRÓXIMA JOGADA
  // ========================================
  function mostrarGif(caminho) {
    if (!DOM.gifContainer) {
      console.error('❌ Container de GIF não encontrado!');
      return;
    }

    // Se já tem um GIF, substitui
    fetch(caminho)
      .then(response => {
        if (!response.ok) {
          console.warn(`⚠️ GIF não encontrado: ${caminho}`);
          const fallback = './images/alice-hana.gif';
          return fetch(fallback).then(res => res.ok ? fallback : null);
        }
        return caminho;
      })
      .then(imagemFinal => {
        if (!imagemFinal) {
          console.error('❌ Nenhum GIF disponível!');
          return;
        }

        const img = document.createElement('img');
        img.src = imagemFinal;
        img.className = 'gif-feedback';
        img.alt = 'Resultado';
        img.title = 'Resultado';
        img.loading = 'lazy';

        DOM.gifContainer.innerHTML = '';
        DOM.gifContainer.appendChild(img);
        Estado.gifAtual = imagemFinal;

        // ====================================
        // SEM TIMEOUT - SÓ SERÁ REMOVIDO NO FINAL DA PRÓXIMA JOGADA
        // ====================================
      })
      .catch(() => {
        console.warn('⚠️ Erro ao carregar GIF, usando fallback');
        DOM.gifContainer.innerHTML = `<div style="
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          border: 2px solid #ffcc00;
          font-weight: bold;
          font-size: 14px;
          text-align: center;
        ">🎰 Resultado</div>`;
        Estado.gifAtual = 'fallback';
      });
  }

  // ========================================
  // COMPRA DE CRÉDITOS
  // ========================================
  window.comprarCreditos = function() {
    const confirmar = confirm('💳 Deseja adicionar +' + CONFIG.COMPRA_CREDITOS + ' créditos via Pix?');

    if (confirmar) {
      Estado.creditosValor += CONFIG.COMPRA_CREDITOS;
      DOM.creditos.value = Estado.creditosValor;
      alert('✅ Créditos adicionados com sucesso!');
    }
  };

  // ========================================
  // INICIALIZAÇÃO
  // ========================================
  document.addEventListener('DOMContentLoaded', function() {
    if (!DOM.creditos.value || parseInt(DOM.creditos.value) === 0) {
      DOM.creditos.value = CONFIG.CREDITOS_INICIAIS;
      Estado.creditosValor = CONFIG.CREDITOS_INICIAIS;
    }

    IMAGENS.forEach(img => {
      const preload = new Image();
      preload.src = img;
    });

    if (!DOM.gifContainer) {
      const container = document.createElement('div');
      container.className = 'gif-container';
      container.id = 'gifContainer';
      document.body.appendChild(container);
      DOM.gifContainer = container;
    }

    console.log('🎰 Slot Anime - DANDADAN');
    console.log('📊 Versão 3.3 - SLOTS RODAM DE VERDADE!');
    console.log('🎯 Chance de vitória: 51%');
    console.log('⭐ a003.gif e a007.gif pagam x10!');
    console.log('🚀 Jogo carregado!');
  });

})();