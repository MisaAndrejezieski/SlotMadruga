// Configuração (pesos e multiplicadores mantidos)
const imagens = [
  "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
  "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
  "./images/a007.gif", "./images/a008.gif", "./images/a009.gif", "./images/stella-cute.gif"
];

const pesos = [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.5, 10];
const multiplicadores = [10, 2, 2, 4, 4, 4, 4, 6, 6, 2];

const btnSpin = document.getElementById("btn-spin");
const btnBuy = document.getElementById("btn-buy");
const resultsEl = document.getElementById("results");
const creditsInput = document.getElementById("credits");
const gifContainer = document.getElementById("gifContainer");
const slotEls = document.querySelectorAll(".slots");

let derrotasSeguidas = parseInt(localStorage.getItem("derrotas") || "0");

// Função auxiliar: seleciona índice baseado em pesos
function selecionarIndiceComPeso() {
  const total = pesos.reduce((a,b) => a+b, 0);
  let r = Math.random() * total;
  for (let i=0;i<pesos.length;i++){
    r -= pesos[i];
    if (r < 0) return i;
  }
  return 0;
}

// Comprar créditos (simulado)
function comprarCreditos(){
  const valorStr = prompt("Digite quantos créditos deseja comprar (número):", "100");
  if (!valorStr) return;
  const valor = parseInt(valorStr);
  if (isNaN(valor) || valor <= 0) { alert("Valor inválido."); return; }
  creditsInput.value = parseInt(creditsInput.value) + valor;
  alert(`Você comprou ${valor} créditos!`);
}

// Mostrar gif sem bloquear interação
function mostrarGif(tipo){
  gifContainer.innerHTML = "";
  let nome = "";
  if (tipo === "vitoria") nome = "giphy002.gif";
  else if (tipo === "derrota") nome = "giphy003.gif";
  else if (tipo === "muitas") nome = "giphy004.gif";

  if (!nome) return;
  const img = document.createElement("img");
  img.src = `./images/${nome}`;
  img.className = "gif-feedback";
  gifContainer.appendChild(img);

  setTimeout(()=> { gifContainer.innerHTML = ""; }, 3800);
}

// Lógica de jogo: gira com parada sequencial
btnSpin.addEventListener("click", () => {
  let credits = parseInt(creditsInput.value);
  const aposta = 10; // aposta fixa
  if (credits < aposta) {
    resultsEl.textContent = "Créditos insuficientes!";
    resultsEl.className = "lost";
    return;
  }

  // Deduz aposta
  credits -= aposta;
  creditsInput.value = credits;

  resultsEl.textContent = "Rodando...";
  resultsEl.className = "";

  // preparar
  slotEls.forEach(s => {
    s.classList.remove("ganhou");
    s.classList.add("rodando");
  });
  btnSpin.disabled = true;
  btnBuy.disabled = true;

  const resultados = new Array(slotEls.length);

  // Para cada slot, iniciamos um intervalo e param com tempos diferentes (efeito cascata)
  const intervals = [];
  for (let i = 0; i < slotEls.length; i++) {
    const slot = slotEls[i];

    // interval trocando imagens rapidamente
    intervals[i] = setInterval(() => {
      const idx = selecionarIndiceComPeso();
      slot.src = imagens[idx];
    }, 70);

    // tempo para parar este slot (sequencial; últimos param mais tarde)
    const stopAfter = 1200 + i * 300; // ajuste: 1200ms base
    ((index, slotRef) => {
      setTimeout(() => {
        clearInterval(intervals[index]);
        // escolha final com peso
        const finalIdx = selecionarIndiceComPeso();
        slotRef.src = imagens[finalIdx];
        slotRef.classList.remove("rodando");
        resultados[index] = finalIdx;

        // se for o último, processa resultado
        if (index === slotEls.length - 1) {
          processarResultado(resultados, aposta);
          btnSpin.disabled = false;
          btnBuy.disabled = false;
        }
      }, stopAfter);
    })(i, slot);
  }
});

// Verifica combinações vencedoras e aplica ganhos
function processarResultado(resultados, aposta) {
  // combinações válidas
  const combinacoes = [
    [0,1,2], // 123
    [3,4,5], // 456
    [6,7,8], // 789
    [0,4,8], // 159 (diagonal principal)
    [2,4,6]  // 753 (diagonal secundária)
  ];

  let ganhoTotal = 0;
  const slotsGanhadores = new Set();

  combinacoes.forEach(combo => {
    const [a,b,c] = combo;
    if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
      const idxImagem = resultados[a]; // índice da imagem vencedora
      const mult = multiplicadores[idxImagem] || 1;
      ganhoTotal += aposta * mult;
      combo.forEach(i => slotsGanhadores.add(i));
    }
  });

  // limpa GIF
  gifContainer.innerHTML = "";

  if (ganhoTotal > 0) {
    // ganhou
    let credits = parseInt(creditsInput.value);
    credits += ganhoTotal;
    creditsInput.value = credits;
    resultsEl.textContent = `Você ganhou ${ganhoTotal} créditos!`;
    resultsEl.className = "won";
    slotsGanhadores.forEach(i => slotEls[i].classList.add("ganhou"));
    derrotasSeguidas = 0;
    mostrarGif("vitoria");
  } else {
    // perdeu
    resultsEl.textContent = "Mais sorte na próxima vez!";
    resultsEl.className = "lost";
    derrotasSeguidas++;
    if (derrotasSeguidas >= 10) {
      mostrarGif("muitas");
      derrotasSeguidas = 0; // opcional: reset após mostrar
    } else {
      mostrarGif("derrota");
    }
  }

  localStorage.setItem("derrotas", derrotasSeguidas.toString());
}
 
// bind comprar
btnBuy.addEventListener("click", comprarCreditos);
