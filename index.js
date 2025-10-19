function multiplicador() {
  const quantidadeDeSlot = 9;
  const apostaFixa = 10;

  const imagens = [
    "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
    "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
    "./images/a007.gif", "./images/a008.gif", "./images/a009.gif",
    "./images/stella-cute.gif", "./images/a011.gif",
  ];

  const pesos = [0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5, 0.6, 6.5];
  const multiplicadores = [5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1];

  const divImagens = document.querySelector(".images");
  const divResultado = document.getElementById("results");
  const creditos = document.getElementById("creditos");
  const gifContainer = document.getElementById("gifContainer");

  let creditosValor = parseInt(creditos.value);
  let resultados = [];
  let derrotasConsecutivas = parseInt(localStorage.getItem("derrotas") || "0");

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
  slots.forEach(slot => slot.classList.add("rodando"));

  const intervaloRodando = setInterval(() => {
    slots.forEach(slot => {
      const aleatorio = selecionarImagemComPeso();
      slot.src = imagens[aleatorio];
    });
  }, 100);

  setTimeout(() => {
    clearInterval(intervaloRodando);
    slots.forEach(slot => slot.classList.remove("rodando"));
    definirResultados();
    verifiqueSeGanhou();
  }, 2000);

  function selecionarImagemComPeso() {
    const totalPesos = pesos.reduce((a, b) => a + b, 0);
    const numeroAleatorio = Math.random() * totalPesos;
    let somaPesos = 0;
    for (let i = 0; i < pesos.length; i++) {
      somaPesos += pesos[i];
      if (numeroAleatorio < somaPesos) return i;
    }
  }

  function definirResultados() {
    for (let i = 0; i < quantidadeDeSlot; i++) {
      const aleatorio = selecionarImagemComPeso();
      const slotAtual = divImagens.querySelector(`.slot-${i + 1}`);
      slotAtual.src = imagens[aleatorio];
      resultados[i] = imagens[aleatorio];
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

    linhasVencedoras.forEach(linha => {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        const indiceImagem = imagens.indexOf(resultados[a]);
        ganhoTotal += apostaFixa * multiplicadores[indiceImagem];
        ganhou = true;
        linha.forEach(i => slotsGanhadores.add(i));
      }
    });

    gifContainer.innerHTML = "";

    if (ganhou) {
      creditosValor += ganhoTotal;
      creditos.value = creditosValor;
      divResultado.textContent = `Você ganhou ${ganhoTotal} créditos!`;
      divResultado.classList = 'won';
      derrotasConsecutivas = 0;
      gifContainer.innerHTML = `<img src="./images/010.webp" class="gif-feedback">`;
    } else {
      divResultado.textContent = "Mais sorte na próxima vez!";
      divResultado.classList = 'lost';
      derrotasConsecutivas++;
      gifContainer.innerHTML = derrotasConsecutivas >= 10
        ? `<img src="./images/giphy004.gif" class="gif-feedback">`
        : `<img src="./images/giphy001.gif" class="gif-feedback">`;
    }

    localStorage.setItem("derrotas", derrotasConsecutivas);

    slotsGanhadores.forEach(i => {
      document.querySelector(`.slot-${i + 1}`).classList.add("ganhou");
    });
  }
}

function comprarCreditos() {
  const valor = prompt("Digite quantos créditos deseja comprar:");
  if (!valor || isNaN(valor) || valor <= 0) return;
  const creditos = document.getElementById("creditos");
  creditos.value = parseInt(creditos.value) + parseInt(valor);
  alert(`Você comprou ${valor} créditos!`);
}
