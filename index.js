const imagens = [
  "./images/a001.gif","./images/a002.gif","./images/a003.gif",
  "./images/a004.gif","./images/a005.gif","./images/a006.gif",
  "./images/a007.gif","./images/a008.gif","./images/a009.gif","./images/stella-cute.gif"
];
const pesos = [0.6,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.5,10];
const multiplicadores = [10,2,2,4,4,4,4,6,6,2];

const slots = document.querySelectorAll(".slots");
const btnSpin = document.getElementById("btn-spin");
const btnBuy = document.getElementById("btn-buy");
const creditsEl = document.getElementById("credits");
const resultsEl = document.getElementById("results");
const gifContainer = document.getElementById("gifContainer");
let derrotasSeguidas = parseInt(localStorage.getItem("derrotas")||"0");

function selecionarIndiceComPeso(){
  const total = pesos.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for(let i=0;i<pesos.length;i++){ r -= pesos[i]; if(r<0) return i; }
  return 0;
}

function mostrarGif(tipo){
  gifContainer.innerHTML="";
  let nome = tipo==="vitoria"?"giphy002.gif":
             tipo==="derrota"?"giphy003.gif":
             tipo==="muitas"?"giphy004.gif":"";
  if(!nome) return;
  const img = document.createElement("img");
  img.src = `./images/${nome}`;
  img.className="gif-feedback";
  gifContainer.appendChild(img);
  setTimeout(()=>gifContainer.innerHTML="",4000);
}

function comprarCreditos(){
  const valor = parseInt(prompt("Quantos créditos deseja comprar?","100"));
  if(!valor||valor<=0)return;
  creditsEl.value = parseInt(creditsEl.value)+valor;
  alert(`Você comprou ${valor} créditos!`);
}

btnBuy.addEventListener("click",comprarCreditos);

btnSpin.addEventListener("click",()=>{
  let credits = parseInt(creditsEl.value);
  const aposta=10;
  if(credits<aposta){ resultsEl.textContent="Créditos insuficientes!"; resultsEl.className="lost"; return;}
  credits -= aposta; creditsEl.value=credits;
  resultsEl.textContent="Rodando..."; resultsEl.className="";

  btnSpin.disabled=true; btnBuy.disabled=true;
  gifContainer.innerHTML="";

  const resultados = new Array(slots.length);
  const intervals = [];

  slots.forEach((s,i)=>{
    s.classList.remove("ganhou","stop");
    s.classList.add("rodando");

    intervals[i]=setInterval(()=>{
      const idx=selecionarIndiceComPeso();
      s.src=imagens[idx];
    },60);

    const delay = 1200 + i*300; // em cascata
    setTimeout(()=>{
      clearInterval(intervals[i]);
      const finalIdx = selecionarIndiceComPeso();
      s.src = imagens[finalIdx];
      resultados[i]=finalIdx;
      s.classList.remove("rodando");
      s.classList.add("stop");

      if(i===slots.length-1){
        setTimeout(()=>processarResultado(resultados,aposta),500);
        btnSpin.disabled=false; btnBuy.disabled=false;
      }
    },delay + Math.random()*300); // leve variação
  });
});

function processarResultado(resultados,aposta){
  const combinacoes=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]];
  let ganhoTotal=0;
  const slotsGanhadores=new Set();

  combinacoes.forEach(combo=>{
    const[a,b,c]=combo;
    if(resultados[a]===resultados[b] && resultados[a]===resultados[c]){
      const mult=multiplicadores[resultados[a]]||1;
      ganhoTotal += aposta*mult;
      combo.forEach(i=>slotsGanhadores.add(i));
    }
  });

  if(ganhoTotal>0){
    creditsEl.value=parseInt(creditsEl.value)+ganhoTotal;
    resultsEl.textContent=`Você ganhou ${ganhoTotal} créditos!`;
    resultsEl.className="won";
    slotsGanhadores.forEach(i=>slots[i].classList.add("ganhou"));
    derrotasSeguidas=0;
    mostrarGif("vitoria");
  }else{
    resultsEl.textContent="Mais sorte na próxima vez!";
    resultsEl.className="lost";
    derrotasSeguidas++;
    if(derrotasSeguidas>=10){ mostrarGif("muitas"); derrotasSeguidas=0;}
    else mostrarGif("derrota");
  }
  localStorage.setItem("derrotas",derrotasSeguidas.toString());
}
