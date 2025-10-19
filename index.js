let derrotasConsecutivas = 0;

function multiplicador() {
  const slots = document.querySelectorAll('.slots');
  const results = document.getElementById('results');
  const creditos = document.getElementById('creditos');
  const aposta = document.getElementById('aposta');
  const ganhos = document.getElementById('ganhos');
  const jogadas = document.getElementById('jogadas');
  const feedbackContainer = document.getElementById('feedback-gif-container');

  results.className = '';
  feedbackContainer.innerHTML = '';

  let valorAposta = parseInt(aposta.value);
  let valorCreditos = parseInt(creditos.value);

  if (valorCreditos < valorAposta) {
    results.textContent = "Créditos insuficientes!";
    return;
  }

  valorCreditos -= valorAposta;
  creditos.value = valorCreditos;
  jogadas.value = parseInt(jogadas.value) + 1;

  // Animação de rotação
  slots.forEach(slot => slot.classList.add('rodando'));

  setTimeout(() => {
    slots.forEach(slot => slot.classList.remove('rodando'));

    // Sorteia 9 imagens
    const randomNumbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1);
    slots.forEach((slot, i) => {
      slot.src = `./images/a00${randomNumbers[i]}.gif`;
      slot.classList.remove('ganhou');
    });

    // Checa combinações vencedoras
    const linhas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let venceu = false;
    let ganhoTotal = 0;

    linhas.forEach(linha => {
      const [a, b, c] = linha;
      if (
        randomNumbers[a] === randomNumbers[b] &&
        randomNumbers[b] === randomNumbers[c]
      ) {
        venceu = true;
        ganhoTotal += valorAposta * 10;
        linha.forEach(index => slots[index].classList.add('ganhou'));
      }
    });

    if (venceu) {
      derrotasConsecutivas = 0;
      valorCreditos += ganhoTotal;
      ganhos.value = ganhoTotal;
      creditos.value = valorCreditos;
      results.textContent = "Você ganhou!";
      results.classList.add('won');

      mostrarGif('./images/win.gif');
    } else {
      ganhos.value = 0;
      results.textContent = "Você perdeu!";
      results.classList.add('lost');
      derrotasConsecutivas++;

      if (derrotasConsecutivas >= 10) {
        mostrarGif('./images/losestreak.gif');
      } else {
        mostrarGif('./images/lose.gif');
      }
    }
  }, 2000);
}

// Função para exibir o GIF no canto da tela
function mostrarGif(caminho) {
  const container = document.getElementById('feedback-gif-container');
  container.innerHTML = `
    <img src="${caminho}" class="feedback-gif" alt="Resultado">
  `;

  setTimeout(() => {
    container.innerHTML = '';
  }, 4000);
}
