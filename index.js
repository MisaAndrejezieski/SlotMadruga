document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("playButton").addEventListener("click", multiplicador);
  document.getElementById("buyButton").addEventListener("click", comprarCreditos);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      const playBtn = document.getElementById("playButton");
      if (!playBtn.disabled) {
        multiplicador();
      }
    }
  });
});

function multiplicador() {
  const quantidadeDeSlot = 9;

  const imagens = [
    "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
    "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
    "./images/a007.gif", "./images/a008.gif", "./images/a009.gif",
    "./images/a010.gif", "./images/a011.gif"
  ];

  const gifsAlegres = [
    "./images/alegre_b003.gif",
    "./images/alegre_b007.gif",
    "./images/alegre_carlton.webp",
    "./images/alegre_rickdance.webp",
    "./images/alegre_snoopdpg.webp",
    "./images/alegre_stella-cute.gif",
    "./images/alegre_travolta002.webp"
  ];

  const gifsTristes = [
    "./images/triste_giphy004.gif",
    "./images/triste_travolta.webp",
    "./images/tristeza_flies.webp"
  ];

  const pesos = [0.4, 0.4, 0.05, 0.45, 0.45, 0.45, 0.05, 0.5, 0.5, 0.02, 0.02];
  const multiplicadores = [0.5, 0.75, 10, 2, 2.5, 3, 10, 4, 5, 20, 20];

  const divImagens = document.querySelector(".images");
  const divResultado = document.getElementById("results");
  const creditos = document.getElementById("creditos");
  const gifContainer = document.getElementById("gifContainer");
  const apostaInput = document.getElementById("aposta");
  const playBtn = document.getElementById("playButton");

  let creditosValor = parseInt(creditos.value) || 0;
  let apostaFixa = parseInt(apostaInput.value) || 10;
  let resultados = new Array(quantidadeDeSlot);

  playBtn.disabled = true;

  // VERIFICAÇÃO DE FALTAS DE CRÉDITO COM GIF E MENSAGEM
  if (apostaFixa > creditosValor) {
    divResultado.textContent = "❌ Você está sem créditos!";
    divResultado.className = 'lost';
    
    gifContainer.innerHTML = "";
    mostrarGif("./images/triste_giphy004.gif");
    
    playBtn.disabled = false;
    return;
  }

  creditosValor -= apostaFixa;
  creditos.value = creditosValor;

  divResultado.textContent = "Rodando...";
  divResultado.className = "";

  const slots = document.querySelectorAll(".slots");
  slots.forEach(slot => {
    slot.classList.remove("ganhou");
    slot.classList.add("rodando-suave");
  });

  const intervaloRodando = setInterval(() => {
    slots.forEach(slot => {
      const aleatorio = selecionarImagemComPeso();
      slot.src = imagens[aleatorio];
    });
  }, 90);

  setTimeout(() => {
    clearInterval(intervaloRodando);
    slots.forEach(slot => slot.classList.remove("rodando-suave"));

    definirResultadosComChance(0.25);

    slots.forEach((slot, index) => {
      slot.src = resultados[index];
      slot.classList.add("parando");
      setTimeout(() => slot.classList.remove("parando"), 300);
    });

    verifiqueSeGanhou();
    playBtn.disabled = false;
  }, 2500);

  function selecionarImagemComPeso() {
    const totalPesos = pesos.reduce((a, b) => a + b, 0);
    const numeroAleatorio = Math.random() * totalPesos;
    let somaPesos = 0;
    for (let i = 0; i < pesos.length; i++) {
      somaPesos += pesos[i];
      if (numeroAleatorio < somaPesos) return i;
    }
    return pesos.length - 1;
  }

  function checarVitorias(arrResultados) {
    const linhasVencedoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return linhasVencedoras.some(([a, b, c]) => 
      arrResultados[a] && arrResultados[a] === arrResultados[b] && arrResultados[a] === arrResultados[c]
    );
  }

  function definirResultadosComChance(chance) {
    for (let i = 0; i < quantidadeDeSlot; i++) {
      resultados[i] = imagens[selecionarImagemComPeso()];
    }

    const linhasVencedoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    const temVitoria = checarVitorias(resultados);
    const deveGanhar = Math.random() < chance;

    if (deveGanhar && !temVitoria) {
      forcarVitoria(linhasVencedoras);
    } else if (!deveGanhar && temVitoria) {
      quebrarVitoriasGarantidas();
    }
  }

  function forcarVitoria(linhasVencedoras) {
    const linhaEscolhida = linhasVencedoras[Math.floor(Math.random() * linhasVencedoras.length)];
    const isPremium = Math.random() < 0.2;
    const indicesPossiveis = isPremium ? [9, 10] : [0, 1, 3, 4, 5, 7, 8];
    const idxImagem = indicesPossiveis[Math.floor(Math.random() * indicesPossiveis.length)];
    const imagemVencedora = imagens[idxImagem];

    for (const posicao of linhaEscolhida) {
      resultados[posicao] = imagemVencedora;
    }
  }

  function quebrarVitoriasGarantidas() {
    let tentativas = 0;
    while (checarVitorias(resultados) && tentativas < 50) {
      const posAleatoria = Math.floor(Math.random() * quantidadeDeSlot);
      const imgAtual = resultados[posAleatoria];
      const opcoesDiferentes = imagens.filter(img => img !== imgAtual);
      resultados[posAleatoria] = opcoesDiferentes[Math.floor(Math.random() * opcoesDiferentes.length)];
      tentativas++;
    }
  }

  function verifiqueSeGanhou() {
    const linhasVencedoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    let ganhoTotal = 0;
    let ganhou = false;
    const slotsGanhadores = new Set();
    let ultimaImagemVencedora = "";

    linhasVencedoras.forEach(linha => {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        const indiceImagem = imagens.indexOf(resultados[a]);
        const multiplicador = multiplicadores[indiceImagem];
        ganhoTotal += apostaFixa * multiplicador;
        ganhou = true;
        ultimaImagemVencedora = resultados[a];
        linha.forEach(i => slotsGanhadores.add(i));
      }
    });

    gifContainer.innerHTML = "";

    if (ganhou) {
      creditosValor += ganhoTotal;
      creditos.value = creditosValor;
      
      const nomeArquivo = ultimaImagemVencedora.split('/').pop();
      const mult = multiplicadores[imagens.indexOf(ultimaImagemVencedora)];
      
      divResultado.textContent = mult >= 15 
        ? `🔥 JACKPOT! ${ganhoTotal} créditos! (${nomeArquivo} x${mult})`
        : `🎉 Ganhou ${ganhoTotal} créditos! (${nomeArquivo} x${mult})`;
      
      divResultado.className = 'won';
      
      const gifAlegre = gifsAlegres[Math.floor(Math.random() * gifsAlegres.length)];
      mostrarGif(gifAlegre);
    } else {
      divResultado.textContent = "Mais sorte na próxima vez!";
      divResultado.className = 'lost';
      
      const gifTriste = gifsTristes[Math.floor(Math.random() * gifsTristes.length)];
      mostrarGif(gifTriste);
    }

    slotsGanhadores.forEach(i => {
      const slotElement = divImagens.querySelector(`.slot-${i + 1}`);
      if (slotElement) slotElement.classList.add("ganhou");
    });
  }

  function mostrarGif(caminho) {
    gifContainer.innerHTML = `<img src="${caminho}" class="gif-feedback" alt="Resultado">`;
  }
}

function comprarCreditos() {
  const creditos = document.getElementById("creditos");
  let valorAtual = parseInt(creditos.value) || 0;

  if (confirm("💳 Deseja adicionar +100 créditos via Pix?")) {
    valorAtual += 100;
    creditos.value = valorAtual;
    alert("✅ Créditos adicionados com sucesso!");
  }
}