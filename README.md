Documentação do Projeto SlotMadruga

Visão Geral
O SlotMadruga é um jogo de caça-níquel online inspirado no icônico personagem Seu Madruga (do seriado Chaves). Desenvolvido com HTML, CSS e JavaScript, o jogo oferece uma experiência divertida e interativa, onde os jogadores podem apostar créditos e tentar ganhar multiplicadores ao alinhar imagens temáticas do Seu Madruga.

O projeto está hospedado no GitHub e pode ser acessado online através do GitHub Pages.

Links Importantes
Repositório no GitHub: https://github.com/MisaAndrejezieski/SlotMadruga

Site do Jogo: https://misaandrejezieski.github.io/SlotMadruga

Estrutura do Projeto
O projeto está organizado da seguinte forma no repositório:

Copy
SlotMadruga/
├── .gitattributes           # Configurações do Git
├── images/                  # Pasta contendo as imagens do jogo
│   ├── a001.jpg             # Imagem 1 do Seu Madruga
│   ├── a002.jpg             # Imagem 2 do Seu Madruga
│   ├── ...                  # Outras imagens (até a015.jpg)
│   └── tumblr_c2e8441ba9e6c32473da1b447b369b55_3f7ab16a_500.webp # Imagem de fundo
├── index.html               # Arquivo principal do jogo (HTML)
├── index.css                # Estilos do jogo (CSS)
├── index.js                 # Lógica do jogo (JavaScript)
└── README.md                # Documentação do projeto (este arquivo)
Instalação e Execução
Requisitos
Navegador moderno (Google Chrome, Firefox, Edge, etc.).

Conexão com a internet (para acessar o site hospedado).

Execução Online
Acesse o site do jogo: https://misaandrejezieski.github.io/SlotMadruga.

O jogo será carregado automaticamente no navegador.

Execução Local
Clone o repositório do GitHub:

bash
Copy
git clone https://github.com/MisaAndrejezieski/SlotMadruga.git
Navegue até a pasta do projeto:

bash
Copy
cd SlotMadruga
Abra o arquivo index.html no seu navegador:

Você pode usar um servidor local (por exemplo, o Live Server do Visual Studio Code) para uma experiência mais fluida.

Como Jogar
Interface do Jogo
Título: "Siga-me os bons!!!".

Área de Resultados: Exibe mensagens como "Rodando...", "Você ganhou X créditos!" ou "Qué que foi, Qué que foi, Qué que há!!!".

Slots: 9 imagens que giram durante o jogo.

Controles:

Créditos: Saldo disponível para apostas.

Aposta: Valor que você deseja apostar (mínimo: 1, máximo: 10).

Ganhos: Valor ganho na rodada atual.

Jogadas: Número de vezes que você jogou.

Botão "Jogar": Inicia uma nova rodada.

Regras do Jogo
Defina o valor da aposta (entre 1 e 10 créditos).

Clique em "Jogar" para iniciar a rodada.

Os slots começarão a girar por 2 segundos.

Após os slots pararem, o resultado será verificado:

Linhas ou Colunas Completas: Se três imagens iguais aparecerem em uma linha ou coluna, o jogador ganha um multiplicador.

Multiplicadores Adicionais:

6 imagens iguais: Ganho dobrado.

9 imagens iguais: Ganho triplicado.

O saldo de créditos é atualizado após cada rodada.

Condições de Vitória
Vitória: Ganhe créditos ao alinhar três imagens iguais em uma linha ou coluna.

Derrota: Caso não haja combinações válidas, o jogador perde a aposta.

Fim do Jogo
O jogo termina quando os créditos do jogador chegam a zero.

Detalhes Técnicos
1. index.html
Descrição: Arquivo principal que define a estrutura do jogo.

Funcionalidades:

Contêiner principal com título, área de resultados, slots, controles e botão de jogar.

Links para os arquivos CSS (index.css) e JavaScript (index.js).

2. index.css
Descrição: Arquivo de estilos que define o design e as animações do jogo.

Funcionalidades:

Estilos para o layout, cores, fontes e animações (rotação dos slots, efeitos de vitória/derrota).

Responsividade para dispositivos móveis e desktops.

3. index.js
Descrição: Arquivo de lógica que controla o funcionamento do jogo.

Funcionalidades:

Geração aleatória de imagens nos slots com base em pesos.

Verificação de vitórias (linhas, colunas e multiplicadores).

Atualização dos créditos, ganhos e jogadas.

Animação de rotação dos slots.

4. images/
Descrição: Pasta contendo as imagens usadas no jogo.

Arquivos:

a001.jpg a a015.jpg: Imagens temáticas do Seu Madruga.

tumblr_c2e8441ba9e6c32473da1b447b369b55_3f7ab16a_500.webp: Imagem de fundo do jogo.

5. .gitattributes
Descrição: Arquivo de configuração do Git.

Uso: Define regras para tratamento de arquivos no repositório Git.

Personalização
Imagens: Substitua as imagens na pasta images/ para personalizar o tema do jogo.

Multiplicadores: Ajuste os valores dos multiplicadores no arquivo index.js (variável multiplicadores).

Aposta Máxima: Altere o valor máximo da aposta no campo de input do HTML.

Contribuição
Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

Faça um fork do repositório.

Crie uma branch para sua feature:

bash
Copy
git checkout -b feature/nova-feature
Commit suas alterações:

bash
Copy
git commit -m 'Adiciona nova feature'
Push para a branch:

bash
Copy
git push origin feature/nova-feature
Abra um Pull Request no repositório original.

Licença
O projeto SlotMadruga é open-source e está licenciado sob a MIT License. Sinta-se à vontade para usar, modificar e distribuir o código.

Contato
Para dúvidas, sugestões ou colaborações, entre em contato:

Autor: Misa Andrejezieski

GitHub: https://github.com/MisaAndrejezieski

Site do Jogo: https://misaandrejezieski.github.io/SlotMadruga


