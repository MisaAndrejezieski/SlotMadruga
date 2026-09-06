function multiplicador() {
  const quantidadeDeSlot = 9;

  const imagens = [
    "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
    "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
    "./images/a007.gif", "./images/a008.gif", "./images/a009.gif", "./images/stella-cute.gif"
  ];

  // ========================================
  // CHANCE DE CADA IMAGEM APARECER (0 = nunca, 1 = sempre)
  // Quanto MENOR a chance, MAIS ela paga
  // ========================================
  const pesos = [
    0.25, // a001.gif - MUITO COMUM (paga 0.5x)
    0.25, // a002.gif - MUITO COMUM (paga 0.75x)
    0.01, // a003.gif - MUITO RARO (paga 20x) ⭐
    0.15, // a004.gif - COMUM (paga 2x)
    0.15, // a005.gif - COMUM (paga 2.5x)
    0.15, // a006.gif - COMUM (paga 3x)
    0.01, // a007.gif - MUITO RARO (paga 20x) ⭐
    0.12, // a008.gif - MÉDIO (paga 4x)
    0.10, // a009.gif - MÉDIO (paga 5x)
    0.07  // stella-cute.gif - MÉDIO (paga 1x)
  ];

  // ========================================
  // MULTIPLICADORES (quanto MENOS chance, MAIS paga)
  // ========================================
  const multiplicadores = [
    0.5,  // a001.gif - COMUM (paga pouco)
    0.75, // a002.gif - COMUM (paga pouco)
    20,   // a003.gif - RARO (paga MUITO) ⭐
    2,    // a004.gif - COMUM (paga médio)
    2.5,  // a005.gif - COMUM (paga médio)
    3,    // a006.gif - COMUM (paga médio)
    20,   // a007.gif - RARO (paga MUITO) ⭐
    4,    // a008.gif - MÉDIO (paga médio)
    5,    // a009.gif - MÉDIO (paga médio)
    1     // stella-cute.gif - MÉDIO (paga pouco)
  ];

  const divImagens = document.querySelector(".images");
  const divResultado = document.getElementById("results");
  const creditos = document.getElementById("creditos");
  const gifContainer = document.getElementById("gifContainer");
  const apostaInput = document.getElementById("aposta");

  let creditosValor = parseInt(creditos.value);
  let resultados = [];
  let derrotasConsecutivas = parseInt(localStorage.getItem("derrotas") || "0");
  let apostaFixa = parseInt(apostaInput.value) || 10;

  if (apostaFixa > creditosValor) {
    divResultado.textContent = "Créditos insuficientes!";
    divResultado.classList = 'lost';
    return;
  }

  creditosValor -= apostaFixa;
  creditos.value = creditosValor;

  divResultado.textContent = "Rodando...";
  divResultado.classList = "";

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
  }, 80);

  setTimeout(() => {
    clearInterval(intervaloRodando);
    slots.forEach(slot => slot.classList.remove("rodando-suave"));

    slots.forEach(slot => {
      slot.classList.add("parando");
      setTimeout(() => {
        slot.classList.remove("parando");
      }, 300);
    });

    // CHANCE DE VITÓRIA: 25% (o jogador ganha 1 a cada 4 rodadas)
    definirResultadosComChance(0.25);
    verifiqueSeGanhou();
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

  function definirResultadosComChance(chance) {
    for (let i = 0; i < quantidadeDeSlot; i++) {
      const aleatorio = selecionarImagemComPeso();
      const slotAtual = divImagens.querySelector(`.slot-${i + 1}`);
      slotAtual.src = imagens[aleatorio];
      resultados[i] = imagens[aleatorio];
    }

    const linhasVencedoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    let temVitoria = false;
    for (const linha of linhasVencedoras) {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        temVitoria = true;
        break;
      }
    }

    const deveGanhar = Math.random() < chance;

    if (deveGanhar && !temVitoria) {
      forcarVitoria(linhasVencedoras);
    } else if (!deveGanhar && temVitoria) {
      quebrarVitoria(linhasVencedoras);
    }
  }

  function forcarVitoria(linhasVencedoras) {
    const linhaEscolhida = linhasVencedoras[Math.floor(Math.random() * linhasVencedoras.length)];
    
    // 10% de chance de ser premium (a003/a007)
    let idxImagem;
    if (Math.random() < 0.1) {
      const indicesPremium = [2, 6];
      idxImagem = indicesPremium[Math.floor(Math.random() * indicesPremium.length)];
    } else {
      // Escolhe entre as imagens mais comuns (que pagam pouco)
      const indicesComuns = [0, 1, 3, 4, 5, 7, 8, 9];
      idxImagem = indicesComuns[Math.floor(Math.random() * indicesComuns.length)];
    }
    
    const imagemVencedora = imagens[idxImagem];

    for (const posicao of linhaEscolhida) {
      const slotAtual = divImagens.querySelector(`.slot-${posicao + 1}`);
      slotAtual.src = imagemVencedora;
      resultados[posicao] = imagemVencedora;
    }
  }

  function quebrarVitoria(linhasVencedoras) {
    const linhasAtuais = [];
    for (const linha of linhasVencedoras) {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        linhasAtuais.push(linha);
      }
    }

    for (const linha of linhasAtuais) {
      const posicaoParaTrocar = linha[Math.floor(Math.random() * linha.length)];
      let novaImagem;
      let tentativas = 0;
      do {
        const idx = selecionarImagemComPeso();
        novaImagem = imagens[idx];
        tentativas++;
      } while (tentativas < 20 && novaImagem === resultados[posicaoParaTrocar]);
      
      const slotAtual = divImagens.querySelector(`.slot-${posicaoParaTrocar + 1}`);
      slotAtual.src = novaImagem;
      resultados[posicaoParaTrocar] = novaImagem;
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
    let imagemVencedora = "";
    let multiplicadorUsado = 0;

    linhasVencedoras.forEach(linha => {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        const indiceImagem = imagens.indexOf(resultados[a]);
        const multiplicador = multiplicadores[indiceImagem];
        ganhoTotal += apostaFixa * multiplicador;
        ganhou = true;
        imagemVencedora = resultados[a];
        multiplicadorUsado = multiplicador;
        linha.forEach(i => slotsGanhadores.add(i));
      }
    });

    gifContainer.innerHTML = "";

    if (ganhou) {
      creditosValor += ganhoTotal;
      creditos.value = creditosValor;
      
      const nomeArquivo = imagemVencedora.split('/').pop();
      
      if (multiplicadorUsado >= 15) {
        divResultado.textContent = `🔥 JACKPOT! ${ganhoTotal} créditos! (${nomeArquivo} x${multiplicadorUsado})`;
      } else if (multiplicadorUsado >= 5) {
        divResultado.textContent = `🎉 Grande vitória! ${ganhoTotal} créditos! (${nomeArquivo} x${multiplicadorUsado})`;
      } else {
        divResultado.textContent = `🎉 Ganhou ${ganhoTotal} créditos! (${nomeArquivo} x${multiplicadorUsado})`;
      }
      divResultado.classList = 'won';
      derrotasConsecutivas = 0;
      
      if (multiplicadorUsado >= 15) {
        mostrarGif("./images/a010.gif");
      } else if (multiplicadorUsado >= 5) {
        mostrarGif("./images/a011.gif");
      } else if (multiplicadorUsado >= 3) {
        mostrarGif("./images/b003.gif");
      } else {
        mostrarGif("./images/b007.gif");
      }
    } else {
      divResultado.textContent = "Mais sorte na próxima vez!";
      divResultado.classList = 'lost';
      derrotasConsecutivas++;
      
      if (derrotasConsecutivas >= 10) {
        mostrarGif("./images/giphy004.gif");
        derrotasConsecutivas = 0;
      } else if (derrotasConsecutivas >= 5) {
        mostrarGif("./images/giphy001.gif");
      } else {
        mostrarGif("./images/alice-hana.gif");
      }
    }

    localStorage.setItem("derrotas", derrotasConsecutivas);

    slotsGanhadores.forEach(i => {
      document.querySelector(`.slot-${i + 1}`).classList.add("ganhou");
    });
  }

  function mostrarGif(caminho) {
    gifContainer.innerHTML = `<img src="${caminho}" class="gif-feedback" alt="Resultado" title="Resultado">`;
  }
}

function comprarCreditos() {
  const creditos = document.getElementById("creditos");
  let valorAtual = parseInt(creditos.value);

  const confirmar = confirm("💳 Deseja adicionar +100 créditos via Pix?");
  if (confirmar) {
    valorAtual += 100;
    creditos.value = valorAtual;
    alert("✅ Créditos adicionados com sucesso!");
  }
}