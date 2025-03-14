function multiplicador() {
    const quantidadeDeSlot = 9;
    var imagens = [
        "./images/a001.jpg", "./images/a002.jpg", "./images/a003.jpg",
        "./images/a004.jpg", "./images/a005.jpg", "./images/a006.jpg",
        "./images/a007.jpg", "./images/a008.jpg", "./images/a009.jpg",
        "./images/a010.jpg", "./images/a011.jpg", "./images/a012.jpg",
        "./images/a013.jpg", "./images/a014.jpg", "./images/a015.jpg",
    ];
    var pesos = [5, 1, 1, 0.5, 0.5, 0.5, 0.25, 0.25, 0.25, 0.10, 0.10, 0.10, 0.05, 0.05, 0.05];
    var multiplicadores = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9];
    var resultados = [];

    var divImagens = document.querySelector(".images");
    var divResultado = document.getElementById("results");
    var creditos = document.getElementById("creditos");
    var aposta = document.getElementById("aposta");
    var ganhos = document.getElementById("ganhos");
    var jogadas = document.getElementById("jogadas");

    var apostaValor = parseInt(aposta.value);
    var creditosValor = parseInt(creditos.value);
    var jogadasValor = parseInt(jogadas.value);

    // Verifica se o jogador tem créditos suficientes
    if (apostaValor > creditosValor) {
        divResultado.innerHTML = "Créditos insuficientes!";
        divResultado.classList = 'lost';
        return;
    }

    // Deduz a aposta dos créditos e incrementa o contador de jogadas
    creditosValor -= apostaValor;
    creditos.value = creditosValor;
    jogadasValor += 1;
    jogadas.value = jogadasValor;

    // Reseta o estado do resultado
    divResultado.classList = "";
    divResultado.innerHTML = "Rodando...";

    // Remove bordas verdes de slots anteriores (se houver)
    var slots = document.querySelectorAll(".slots");
    slots.forEach(slot => slot.classList.remove("ganhou"));

    // Inicia a rotação dos slots
    slots.forEach(slot => slot.classList.add("rodando"));

    // Intervalo para mudar as imagens durante a rotação
    var intervaloRodando = setInterval(function () {
        slots.forEach(slot => {
            var aleatorio = selecionarImagemComPeso();
            slot.src = imagens[aleatorio];
        });
    }, 100); // Muda as imagens a cada 100ms

    // Para a rotação após 2 segundos e verifica o resultado
    setTimeout(function () {
        clearInterval(intervaloRodando); // Para de mudar as imagens
        slots.forEach(slot => slot.classList.remove("rodando"));
        definirResultados();
        verifiqueSeGanhou();
    }, 2000); // 2 segundos de rotação

    // Função para definir os resultados finais dos slots
    function definirResultados() {
        for (var i = 0; i < quantidadeDeSlot; i++) {
            var aleatorio = selecionarImagemComPeso();
            var slotName = '.slot-' + (i + 1);
            var slotAtual = divImagens.querySelector(slotName);
            slotAtual.src = imagens[aleatorio];
            resultados[i] = imagens[aleatorio];
        }
    }

    // Função para selecionar uma imagem com base nos pesos
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

    // Função para verificar se o jogador ganhou
    function verifiqueSeGanhou() {
        var linhas = [
            [resultados[0], resultados[1], resultados[2]], // Linha 1
            [resultados[3], resultados[4], resultados[5]], // Linha 2
            [resultados[6], resultados[7], resultados[8]]  // Linha 3
        ];
        var colunas = [
            [resultados[0], resultados[3], resultados[6]], // Coluna 1
            [resultados[1], resultados[4], resultados[7]], // Coluna 2
            [resultados[2], resultados[5], resultados[8]]  // Coluna 3
        ];

        var ganhoTotal = 0;
        var ganhou = false;
        var slotsGanhadores = new Set(); // Armazena os índices dos slots ganhadores

        // Verifica linhas
        for (var i = 0; i < linhas.length; i++) {
            if (linhas[i][0] === linhas[i][1] && linhas[i][0] === linhas[i][2]) {
                var indiceImagem = imagens.indexOf(linhas[i][0]);
                var multiplicadorGanho = multiplicadores[indiceImagem];
                ganhoTotal += apostaValor * multiplicadorGanho;
                ganhou = true;

                // Adiciona os slots ganhadores ao conjunto
                slotsGanhadores.add(i * 3);     // Primeiro slot da linha
                slotsGanhadores.add(i * 3 + 1); // Segundo slot da linha
                slotsGanhadores.add(i * 3 + 2); // Terceiro slot da linha
            }
        }

        // Verifica colunas
        for (var i = 0; i < colunas.length; i++) {
            if (colunas[i][0] === colunas[i][1] && colunas[i][0] === colunas[i][2]) {
                var indiceImagem = imagens.indexOf(colunas[i][0]);
                var multiplicadorGanho = multiplicadores[indiceImagem];
                ganhoTotal += apostaValor * multiplicadorGanho;
                ganhou = true;

                // Adiciona os slots ganhadores ao conjunto
                slotsGanhadores.add(i);         // Primeiro slot da coluna
                slotsGanhadores.add(i + 3);     // Segundo slot da coluna
                slotsGanhadores.add(i + 6);     // Terceiro slot da coluna
            }
        }

        // Verifica quantas vezes cada imagem aparece nos resultados
        var contagemImagens = {};
        resultados.forEach(imagem => {
            if (contagemImagens[imagem]) {
                contagemImagens[imagem]++;
            } else {
                contagemImagens[imagem] = 1;
            }
        });

        // Aplica multiplicador adicional para 6 ou 9 imagens iguais
        for (var imagem in contagemImagens) {
            if (contagemImagens[imagem] >= 6) {
                var indiceImagem = imagens.indexOf(imagem);
                var multiplicadorAdicional = (contagemImagens[imagem] >= 9) ? 3 : 2; // Triplica se 9, dobra se 6
                ganhoTotal *= multiplicadorAdicional;
                divResultado.innerHTML += ` (${multiplicadorAdicional}x por ${contagemImagens[imagem]} imagens iguais!)`;
            }
        }

        // Atualiza o estado do jogo com base no resultado
        if (ganhou) {
            creditosValor += ganhoTotal;
            creditos.value = creditosValor;
            ganhos.value = ganhoTotal;
            divResultado.innerHTML = "Não contava com minha astusia! Você ganhou " + ganhoTotal + " créditos!";
            divResultado.classList = 'won';

            // Adiciona borda verde aos slots ganhadores
            slotsGanhadores.forEach(indice => {
                var slotGanhador = document.querySelector(`.slot-${indice + 1}`);
                slotGanhador.classList.add("ganhou");
            });
        } else {
            ganhos.value = 0;
            divResultado.innerHTML = "(Qué que foi, Qué que foi, Qué que há!!! )";
            divResultado.classList = 'lost';
        }

        // Zera o contador de jogadas se os créditos acabarem
        if (creditosValor <= 0) {
            jogadas.value = 0;
        }
    }
}
