function multiplicador() {
    const quantidadeDeSlot = 9;
    var imagens = [
        "./images/a001.gif", "./images/a002.gif", "./images/a003.gif",
        "./images/a004.gif", "./images/a005.gif", "./images/a006.gif",
        "./images/a007.gif", "./images/a008.gif", "./images/a009.gif", "./images/a010.webp"
    ];
    var pesos = [0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.5, 10];
    var multiplicadores = [10, 2, 2, 4, 4, 4, 4, 6, 6, 2];
    var resultados = [];

    var divImagens = document.querySelector(".images");
    var divResultado = document.getElementById("results");
    var creditos = document.getElementById("creditos");
    var aposta = document.getElementById("aposta");
    var ganhos = document.getElementById("ganhos");
    var jogadas = document.getElementById("jogadas");

    // GIFs
    const gifContainer = document.getElementById("gif-container");
    const gifDisplay = document.getElementById("gif-display");
    const gifVitoria = "./images/giphy002.gif";
    const gifDerrota = "./images/giphy003.gif";
    const gifDerrota10 = "./images/giphy004.gif";
    let contadorDerrotas = window.contadorDerrotas || 0;

    function mostrarGif(tipo) {
        gifContainer.classList.add("ativo");
        if (tipo === "vitoria") {
            gifDisplay.src = gifVitoria;
            contadorDerrotas = 0;
        } else if (tipo === "derrota") {
            contadorDerrotas++;
            if (contadorDerrotas >= 10) {
                gifDisplay.src = gifDerrota10;
                contadorDerrotas = 0;
            } else {
                gifDisplay.src = gifDerrota;
            }
        }
        setTimeout(() => {
            gifContainer.classList.remove("ativo");
            gifDisplay.src = "";
        }, 4000);
        window.contadorDerrotas = contadorDerrotas;
    }

    var apostaValor = parseInt(aposta.value);
    var creditosValor = parseInt(creditos.value);
    var jogadasValor = parseInt(jogadas.value);

    if (apostaValor > creditosValor) {
        divResultado.innerHTML = "Créditos insuficientes!";
        divResultado.classList = 'lost';
        mostrarGif("derrota");
        return;
    }

    creditosValor -= apostaValor;
    creditos.value = creditosValor;
    jogadasValor += 1;
    jogadas.value = jogadasValor;

    divResultado.classList = "";
    divResultado.innerHTML = "Rodando...";

    var slots = document.querySelectorAll(".slots");
    slots.forEach(slot => slot.classList.remove("ganhou"));
    slots.forEach(slot => slot.classList.add("rodando"));

    var intervaloRodando = setInterval(function () {
        slots.forEach(slot => {
            var aleatorio = selecionarImagemComPeso();
            slot.src = imagens[aleatorio];
        });
    }, 100);

    setTimeout(function () {
        clearInterval(intervaloRodando);
        slots.forEach(slot => slot.classList.remove("rodando"));
        definirResultados();
        verifiqueSeGanhou();
    }, 2500);

    function definirResultados() {
        for (var i = 0; i < quantidadeDeSlot; i++) {
            var aleatorio = selecionarImagemComPeso();
            var slotName = '.slot-' + (i + 1);
            var slotAtual = divImagens.querySelector(slotName);
            slotAtual.src = imagens[aleatorio];
            resultados[i] = imagens[aleatorio];
        }
    }

    function selecionarImagemComPeso() {
        var totalPesos = pesos.reduce((a, b) => a + b, 0);
        var numeroAleatorio = Math.random() * totalPesos;
        var somaPesos = 0;
        for (var i = 0; i < pesos.length; i++) {
            somaPesos += pesos[i];
            if (numeroAleatorio < somaPesos) {
                return i;
            }
        }
    }

    function verifiqueSeGanhou() {
        var linhasVencedoras = [
            [0, 1, 2], // Linha 1
            [3, 4, 5], // Linha 2
            [6, 7, 8], // Linha 3
            [0, 4, 8], // Diagonal principal
            [2, 4, 6]  // Diagonal inversa
        ];

        var ganhoTotal = 0;
        var ganhou = false;

        for (var combinacao of linhasVencedoras) {
            const [a, b, c] = combinacao;
            if (resultados[a] === resultados[b] && resultados[a] === resultados[c]) {
                var indiceImagem = imagens.indexOf(resultados[a]);
                var multiplicadorGanho = multiplicadores[indiceImagem];
                ganhoTotal += apostaValor * multiplicadorGanho;
                ganhou = true;
                combinacao.forEach(indice => {
                    var slotGanhador = document.querySelector(`.slot-${indice + 1}`);
                    slotGanhador.classList.add("ganhou");
                });
            }
        }

        if (ganhou) {
            creditosValor += ganhoTotal;
            creditos.value = creditosValor;
            ganhos.value = ganhoTotal;
            divResultado.innerHTML = "Você ganhou " + ganhoTotal + " créditos!";
            divResultado.classList = 'won';
            mostrarGif("vitoria");
        } else {
            ganhos.value = 0;
            divResultado.innerHTML = "Mais sorte na próxima vez!";
            divResultado.classList = 'lost';
            mostrarGif("derrota");
            if(derrotas>=10){
                divResumostrarGif("derrota");ltado.innerHTML = "Você perdeu 10 vezes seguidas!";
            }
        }

        if (creditosValor <= 0) {
            jogadas.value = 0;
        }
    }
}
