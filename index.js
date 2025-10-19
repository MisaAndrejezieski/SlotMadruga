let derrotasSeguidas = 0;

function multiplicador() {
    const quantidadeDeSlot = 9;
    const imagens = [
        "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
        "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
        "./images/a007.gif", "./images/a008.gif", "./images/a009.gif", "./images/a010.webp",
    ];
    const pesos = [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7];
    const multiplicadores = [10, 2, 2, 4, 4, 4, 4, 6, 6, 2];
    const resultados = [];

    const divImagens = document.querySelector(".images");
    const divResultado = document.getElementById("results");
    const creditos = document.getElementById("creditos");
    const aposta = document.getElementById("aposta");
    const ganhos = document.getElementById("ganhos");
    const jogadas = document.getElementById("jogadas");
    const botao = document.getElementById("botao");

    const gifOverlay = document.getElementById("gif-overlay");
    const gifDisplay = document.getElementById("gif-display");

    const gifs = {
        win: "./images/win.gif",
        lose: "./images/lose.gif",
        unlucky: "./images/unlucky.gif"
    };

    let apostaValor = parseInt(aposta.value);
    let creditosValor = parseInt(creditos.value);
    let jogadasValor = parseInt(jogadas.value);

    // Créditos suficientes?
    if (apostaValor > creditosValor) {
        divResultado.textContent = "Créditos insuficientes!";
        divResultado.className = "lost";
        return;
    }

    creditosValor -= apostaValor;
    creditos.value = creditosValor;
    jogadasValor++;
    jogadas.value = jogadasValor;

    divResultado.textContent = "Rodando...";
    divResultado.className = "";
    ganhos.value = 0;
    botao.disabled = true;

    const slots = document.querySelectorAll(".slots");
    slots.forEach(slot => {
        slot.classList.remove("ganhou");
        slot.classList.add("rodando");
    });

    let tempoTotal = 0;
    for (let i = 0; i < quantidadeDeSlot; i++) {
        const slot = slots[i];
        const duracao = 1500 + i * 300;
        rodarSlot(slot, duracao, i);
        tempoTotal = duracao;
    }

    setTimeout(() => {
        verifiqueSeGanhou();
        botao.disabled = false;
    }, tempoTotal + 400);

    function rodarSlot(slot, duracao, indice) {
        const intervalo = setInterval(() => {
            const aleatorio = selecionarImagemComPeso();
            slot.src = imagens[aleatorio];
        }, 75);

        setTimeout(() => {
            clearInterval(intervalo);
            const aleatorioFinal = selecionarImagemComPeso();
            slot.src = imagens[aleatorioFinal];
            slot.classList.remove("rodando");
            resultados[indice] = imagens[aleatorioFinal];

            slot.animate([{ transform: "scale(1)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }],
                { duration: 300, easing: "ease-out" });
        }, duracao);
    }

    function selecionarImagemComPeso() {
        const totalPesos = pesos.reduce((a, b) => a + b, 0);
        const numeroAleatorio = Math.random() * totalPesos;
        let somaPesos = 0;
        for (let i = 0; i < pesos.length; i++) {
            somaPesos += pesos[i];
            if (numeroAleatorio < somaPesos) return i;
        }
        return 0;
    }

    function verifiqueSeGanhou() {
        const combinacoes = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let ganhoTotal = 0;
        let ganhou = false;
        const slotsGanhadores = new Set();

        combinacoes.forEach(indices => {
            const [a, b, c] = indices;
            if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
                const indiceImagem = imagens.indexOf(resultados[a]);
                const ganho = apostaValor * multiplicadores[indiceImagem];
                ganhoTotal += ganho;
                ganhou = true;
                indices.forEach(i => slotsGanhadores.add(i));
            }
        });

        if (ganhou) {
            derrotasSeguidas = 0;
            creditosValor += ganhoTotal;
            creditos.value = creditosValor;
            ganhos.value = ganhoTotal;
            divResultado.textContent = `Você ganhou ${ganhoTotal} créditos!`;
            divResultado.className = "won";
            slotsGanhadores.forEach(i => document.querySelector(`.slot-${i + 1}`).classList.add("ganhou"));
            mostrarGif("./images/giphy002");
        } else {
            derrotasSeguidas++;
            ganhos.value = 0;
            divResultado.textContent = "Mais sorte na próxima vez!";
            divResultado.className = "lost";
            if (derrotasSeguidas >= 10) {
                mostrarGif("./images/giphy002");
            } else {
                mostrarGif("./images/giphy003");
            }
        }

        if (creditosValor <= 0) {
            jogadas.value = 0;
        }
    }

    function mostrarGif(caminho) {
        gifDisplay.src = caminho;
        gifOverlay.classList.remove("hidden");
        gifOverlay.classList.add("show");
        setTimeout(() => {
            gifOverlay.classList.remove("show");
            gifOverlay.classList.add("hidden");
        }, 3500);
    }
}
