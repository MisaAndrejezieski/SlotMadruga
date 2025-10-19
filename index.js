let derrotasSeguidas = 0;

function multiplicador() {
  const quantidadeDeSlot = 9;
  const imagens = [
    "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
    "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
    "./images/a007.gif", "./images/a008.gif", "./images/a009.gif", "./images/tumblr_d35aa4a352f1b995567ad108934ae79d_ad56f61e_540.webp",
  ];
  const pesos = [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.5, 10];
  const multiplicadores = [10, 2, 2, 4, 4, 4, 4, 6, 6, 2];
  const resultados = [];

  const divImagens = document.querySelector(".images");
  const divResultado = document.getElementById("results");
  const creditos = document.getElementById("creditos");
  const aposta = document.getElementById("aposta");
  const ganhos = document.getElementById("ganhos");
  const jogadas = document.getElementById("jogadas");
  const gifFeedback = document.getElementById("gifFeedback");

  let apostaValor = parseInt(aposta.value);
  let creditosValor = parseInt(creditos.value);
  let jogadasValor = parseInt(jogadas.value);

  if (apostaValor > creditosValor) {
    divResultado.innerHTML = "Créditos insuficientes!";
    divResultado.classList = 'lost';
    return;
  }

  creditosValor -= apostaValor;
  creditos.value = creditosValor;
  jogadasValor += 1;
  jogadas.value = jogadasValor;

  divResultado.classList = "";
  divResultado.innerHTML = "Rodando...";

  const slots = document.querySelectorAll(".slots");
  slots.forEach(slot => slot.classList.remove("ganhou"));
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
    verificarLinhasDePremio();
  }, 2000);

  function definirResultados() {
    for (let i = 0; i < quantidadeDeSlot; i++) {
      const aleatorio = selecionarImagemComPeso();
      const slotName = `.slot-${i + 1}`;
      const slotAtual = divImagens.querySelector(slotName);
      slotAtual.src = imagens[aleatorio];
      resultados[i] = imagens[aleatorio];
    }
  }

  function selecionarImagemComPeso() {
    const totalPesos = pesos.reduce((a, b) => a + b, 0);
    let numeroAleatorio = Math.random() * totalPesos;
    let somaPesos = 0;
    for (let i = 0; i < pesos.length; i++) {
      somaPesos += pesos[i];
      if (numeroAleatorio < somaPesos) return i;
    }
  }

  function verificarLinhasDePremio() {
    const linhasPremio = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
      [0, 4, 8], [2, 4, 6]            // Diagonais
    ];

    let ganhoTotal = 0;
    let ganhou = false;
    const slotsGanhadores = new Set();

    for (const linha of linhasPremio) {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        const indiceImagem = imagens.indexOf(resultados[a]);
        const multiplicadorGanho = multiplicadores[indiceImagem];
        ganhoTotal += apostaValor * multiplicadorGanho;
        ganhou = true;
        linha.forEach(i => slotsGanhadores.add(i));
      }
    }

    if (ganhou) {
      derrotasSeguidas = 0;
      creditosValor += ganhoTotal;
      creditos.value = creditosValor;
      ganhos.value = ganhoTotal;
      divResultado.innerHTML = "Você ganhou " + ganhoTotal + " créditos!";
      divResultado.classList = 'won';
      mostrarGif("./images/a010.webp");

      slotsGanhadores.forEach(indice => {
        const slotGanhador = document.querySelector(`.slot-${indice + 1}`);
        slotGanhador.classList.add("ganhou");
      });
    } else {
      ganhos.value = 0;
      divResultado.innerHTML = "Mais sorte na próxima vez!";
      divResultado.classList = 'lost';
      derrotasSeguidas++;
      if (derrotasSeguidas >= 10) {
        mostrarGif("./images/giphy004.gif");
      } else {
        mostrarGif("./images/giphy001.gif");
      }
    }

    if (creditosValor <= 0) {
      jogadas.value = 0;
    }
  }

  function mostrarGif(caminho) {
    gifFeedback.innerHTML = `<img src="${caminho}" alt="Feedback" />`;
    gifFeedback.classList.add("ativo");
    setTimeout(() => {
      gifFeedback.classList.remove("ativo");
    }, 4000);
  }
}
