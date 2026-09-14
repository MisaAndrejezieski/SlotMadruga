const IMAGENS = [
  "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
  "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
  "./images/a007.gif", "./images/a008.gif", "./images/a009.gif",
  "./images/a010.gif", "./images/a011.gif"
];

const PESOS = [30, 30, 30, 15, 15, 15, 8, 8, 3, 3, 1];
const MULTIPLICADORES = [0.5, 0.75, 2, 2.5, 3, 4, 5, 10, 20, 50, 100];

const LINHAS_VENCEDORAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const GIFS_ALEGRES = [
  "./images/alegre_b003.gif", "./images/alegre_b007.gif",
  "./images/alegre_carlton.webp", "./images/alegre_rickdance.webp",
  "./images/alegre_snoopdpg.webp", "./images/alegre_stella-cute.gif",
  "./images/alegre_travolta002.webp"
];

const GIFS_TRISTES = [
  "./images/triste_giphy004.gif", "./images/triste_travolta.webp",
  "./images/tristeza_flies.webp"
];

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playButton");
  const buyBtn = document.getElementById("buyButton");

  playBtn.addEventListener("click", jogar);
  buyBtn.addEventListener("click", comprarCreditos);

  document.addEventListener("keydown", (event) => {
    if ((event.code === "Space" || event.code === "Enter") && !playBtn.disabled) {
      event.preventDefault();
      jogar();
    }
  });
});

function selecionarImagemComPeso() {
  const totalPesos = PESOS.reduce((a, b) => a + b, 0);
  let numeroAleatorio = Math.random() * totalPesos;
  
  for (let i = 0; i < PESOS.length; i++) {
    if (numeroAleatorio < PESOS[i]) return i;
    numeroAleatorio -= PESOS[i];
  }
  return PESOS.length - 1;
}

function jogar() {
  const playBtn = document.getElementById("playButton");
  const creditosInput = document.getElementById("creditos");
  const apostaSelect = document.getElementById("aposta");
  const divResultado = document.getElementById("results");
  const slots = document.querySelectorAll(".slots");
  const gifContainer = document.getElementById("gifContainer");

  let creditos = parseInt(creditosInput.value) || 0;
  const aposta = parseInt(apostaSelect.value) || 10;

  if (aposta > creditos) {
    divResultado.textContent = "❌ Saldo Insuficiente!";
    divResultado.className = 'lost';
    mostrarGif(GIFS_TRISTES[0]);
    return;
  }

  creditos -= aposta;
  creditosInput.value = creditos;
  playBtn.disabled = true;
  gifContainer.innerHTML = "";
  divResultado.textContent = "Girando...";
  divResultado.className = "";

  slots.forEach(slot => {
    slot.classList.remove("ganhou");
    slot.classList.add("rodando-suave");
  });

  const intervaloGiro = setInterval(() => {
    slots.forEach(slot => {
      const idx = Math.floor(Math.random() * IMAGENS.length);
      slot.src = IMAGENS[idx];
    });
  }, 80);

  setTimeout(() => {
    clearInterval(intervaloGiro);

    const resultados = [];
    slots.forEach((slot) => {
      const idxSorteado = selecionarImagemComPeso();
      resultados.push(idxSorteado);
      slot.src = IMAGENS[idxSorteado];
      slot.classList.remove("rodando-suave");
      slot.classList.add("parando");
      setTimeout(() => slot.classList.remove("parando"), 300);
    });

    avaliarResultado(resultados, aposta);
    playBtn.disabled = false;
  }, 2000);
}

function avaliarResultado(resultados, aposta) {
  const creditosInput = document.getElementById("creditos");
  const divResultado = document.getElementById("results");
  const slots = document.querySelectorAll(".slots");
  let ganhoTotal = 0;
  const slotsGanhadores = new Set();

  const telaCheia = resultados.every(val => val === resultados[0]);

  if (telaCheia) {
    ganhoTotal = aposta * 1000;
    resultados.forEach((_, idx) => slotsGanhadores.add(idx));
  } else {
    LINHAS_VENCEDORAS.forEach(linha => {
      const [a, b, c] = linha;
      if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
        const idxSimbolo = resultados[a];
        ganhoTotal += aposta * MULTIPLICADORES[idxSimbolo];
        linha.forEach(index => slotsGanhadores.add(index));
      }
    });
  }

  if (ganhoTotal > 0) {
    let creditos = parseInt(creditosInput.value) || 0;
    creditos += ganhoTotal;
    creditosInput.value = creditos;

    divResultado.textContent = `🎉 Ganhou ${ganhoTotal} créditos!`;
    divResultado.className = 'won';

    slotsGanhadores.forEach(idx => slots[idx].classList.add("ganhou"));

    const gif = GIFS_ALEGRES[Math.floor(Math.random() * GIFS_ALEGRES.length)];
    mostrarGif(gif);
  } else {
    divResultado.textContent = "Mais sorte na próxima!";
    divResultado.className = 'lost';

    const gif = GIFS_TRISTES[Math.floor(Math.random() * GIFS_TRISTES.length)];
    mostrarGif(gif);
  }
}

function mostrarGif(caminho) {
  const gifContainer = document.getElementById("gifContainer");
  gifContainer.innerHTML = `<img src="${caminho}" class="gif-feedback" alt="Feedback">`;
}

function comprarCreditos() {
  const creditosInput = document.getElementById("creditos");
  let valorAtual = parseInt(creditosInput.value) || 0;

  if (confirm("💳 Deseja adicionar +100 créditos?")) {
    valorAtual += 100;
    creditosInput.value = valorAtual;
  }
}