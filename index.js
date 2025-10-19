const spinButton = document.getElementById("spin");
const results = document.getElementById("results");
const creditsInput = document.getElementById("credits");
const gifContainer = document.getElementById("gifContainer");

const slots = document.querySelectorAll(".slots");
const imagens = [
  "a001.gif", "a002.gif", "a003.gif", "a004.gif",
  "a005.gif", "a006.gif", "a007.gif", "a008.gif"
];

function girarSlot() {
  return imagens[Math.floor(Math.random() * imagens.length)];
}

function mostrarGif(tipo) {
  gifContainer.innerHTML = "";

  let gif = "";
  if (tipo === "vitoria") gif = "giphy002.gif";
  else if (tipo === "derrota") gif = "giphy003.gif";
  else if (tipo === "10derrotas") gif = "giphy004.gif";

  const img = document.createElement("img");
  img.src = `./images/${gif}`;
  img.classList.add("gif-feedback");
  gifContainer.appendChild(img);

  setTimeout(() => (gifContainer.innerHTML = ""), 4000);
}

let derrotasSeguidas = 0;

spinButton.addEventListener("click", () => {
  let creditos = parseInt(creditsInput.value);
  if (creditos <= 0) {
    results.textContent = "Sem créditos!";
    results.className = "lost";
    return;
  }

  spinButton.disabled = true;
  results.textContent = "Girando...";
  results.className = "";

  slots.forEach(slot => slot.classList.add("spin"));

  setTimeout(() => {
    slots.forEach(slot => {
      slot.classList.remove("spin");
      slot.src = `./images/${girarSlot()}`;
    });

    const srcs = Array.from(slots).map(s => s.src);
    const ganhou = srcs.every(v => v === srcs[0]);

    if (ganhou) {
      creditos += 50;
      results.textContent = "🎉 Você ganhou!";
      results.className = "won";
      mostrarGif("vitoria");
      derrotasSeguidas = 0;
    } else {
      creditos -= 10;
      results.textContent = "💀 Tente novamente!";
      results.className = "lost";
      derrotasSeguidas++;
      mostrarGif(derrotasSeguidas >= 10 ? "10derrotas" : "derrota");
    }

    creditsInput.value = creditos;
    spinButton.disabled = false;
  }, 2000);
});
