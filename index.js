function multiplicador() {
  const quantidadeDeSlot = 9;

  const imagens = [
    "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
    "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
    "./images/a007.gif", "./images/a008.gif", "./images/a009.gif", "./images/stella-cute.gif"
  ];

  // Pesos: imagens boas são EXTREMAMENTE raras
  const pesos = [0.4, 0.4, 0.01, 0.45, 0.45, 0.45, 0.01, 0.5, 0.5, 0.6];
  
  // Multiplicadores: quando paga, paga bem
  const multiplicadores = [0.5, 0.75, 20, 2, 2.5, 3, 20, 4, 5, 1];

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

    // CHANCE BAIXA: 25%
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
    
    // 20% de chance de ser premium (a003/a007)
    let idxImagem;
    if (Math.random() < 0.2) {
      const indicesPremium = [2, 6];
      idxImagem = indicesPremium[Math.floor(Math.random() * indicesPremium.length)];
    } else {
      const indicesBons = [0, 1, 3, 4, 5, 7, 8];
      idxImagem = indicesBons[Math.floor(Math.random() * indicesBons.length)];
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

    linhasVencedoras.forEach(linha => {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        const indiceImagem = imagens.indexOf(resultados[a]);
        const multiplicador = multiplicadores[indiceImagem];
        ganhoTotal += apostaFixa * multiplicador;
        ganhou = true;
        imagemVencedora = resultados[a];
        linha.forEach(i => slotsGanhadores.add(i));
      }
    });

    gifContainer.innerHTML = "";

    if (ganhou) {
      creditosValor += ganhoTotal;
      creditos.value = creditosValor;
      
      const nomeArquivo = imagemVencedora.split('/').pop();
      const mult = multiplicadores[imagens.indexOf(imagemVencedora)];
      
      if (mult >= 15) {
        divResultado.textContent = `🔥 JACKPOT! ${ganhoTotal} créditos! (${nomeArquivo} x${mult})`;
      } else {
        divResultado.textContent = `🎉 Ganhou ${ganhoTotal} créditos! (${nomeArquivo} x${mult})`;
      }
      divResultado.classList = 'won';
      derrotasConsecutivas = 0;
      
      if (mult >= 15) {
        mostrarGif("./images/a010.gif");
      } else if (mult >= 5) {
        mostrarGif("./images/a011.gif");
      } else if (mult >= 3) {
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
        mostrarGif("./images/rickdance.webp");
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