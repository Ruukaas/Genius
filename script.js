//Variáveis que vão armazenar a ordem que deve ser clicada, a odem clicada e a pontuação
let order = [];
let clickedOrder = []
let score = 0;

//DOMs dos botões e das mensagens de game over e pontos
const blue = document.querySelector("#blue");
const red = document.querySelector("#red");
const green = document.querySelector("#green");
const yellow = document.querySelector("#yellow");
const start = document.querySelector("#start");
const msgLost = document.querySelector("#lost");
const pontos = document.querySelector("#pontos")

//Objetos audios com os sons de cada botão
const audioAzul = new Audio("audio/azul.mp3");
const audioVermelho = new Audio("audio/vermelho.mp3");
const audioVerde = new Audio("audio/verde.mp3");
const audioAmarelo = new Audio("audio/amarelo.mp3");

//Variável de controle do iniciar jogo, que apenas os métodos playGame e gameOver irão manipular para que o usuário não possa criar um novo jogo enquanto um jogo ainda estiver rodando e também para que o jogo pare de chamar o método shuffleOrder quando der GameOver
let controlStartGame = false;

//Função que irá iniciar o jogo, chamando as funções que limpam a tela e reiniciando o score
function playGame() {
    if(!controlStartGame) { //Quando a variável controlStartGame está falsa, quer dizer que não tem nenhum jogo acontecendo no momento, esse if é para que o usuário não inicie um jogo enquanto estiver acontecendo um jogo no momento
        controlStartGame = true;
        clearMSG(msgLost);
        clearMSG(pontos);
        score = -1;
        nextLevel();
    }
}
//Função que vai limpar da tela o firstChild(no caso do jogo usaremos sempre será um texto) do DOM que foi passado por parâmetro
function clearMSG(DOM) {
    if(DOM.hasChildNodes()) {
        DOM.removeChild(DOM.firstChild);
    }
}

//Função que vai chamar a próxima partida, aumentar o score de pontos,chamar a função que exibe os pontos na tela e zerar o array que armazena os cliques do usuário
function nextLevel() {
    score++;
    showMSG(pontos,score.toString());
    clickedOrder = [];
    shuffleOrder();
}

//Função que vai exibir a mensagem textual no DOM que foi passado por parâmetro
function showMSG(DOM,msg) {
    clearMSG(DOM);
    DOM.appendChild(document.createTextNode(msg));
}

//Função que vai chamar uma cor aleatória e chamar a função que vai acender o botão da cor
function shuffleOrder() {
    if(controlStartGame) {
        let colorOrder = Math.floor(Math.random() * 4);
        order[order.length] = colorOrder;
        

        for(let i in order) {
            let elementColor = createColorElement(order[i]);
            lightColor(elementColor, Number(i) + 1);
        }
    }
}

//Função que vai retornar a variável DOM correspondente ao número da cor passada por parâmetro
function createColorElement(color) {
    if(color == 0) {
        console.log("Verde");
        return green;
    } else if(color == 1) {
        console.log("Vermelho");
        return red;  
    } else if(color == 2) {
        console.log("Amarelo");
        return yellow;
    } else if(color == 3) {
        console.log("Azul");
        return blue;
    } else {
        return "deu ruim";
    }
}

// Função que vai acender a cor passada por parâmetro por um tempo e depois apagar ela, e também vai chamar a função que vai tocar o som do botão que vai acender
let lightColor = (element, number) => {
    number = number * 1000;
    setTimeout(() => {
        whichAudioToPlay(element);
        element.classList.add('selected');
    }, number - 500);
    setTimeout(() => {
        element.classList.remove('selected');
    }, number - 100);
}

//Função que vai tocar o som do botão passado por parâmetro
function whichAudioToPlay(element) {
    if(controlStartGame) {//Como essa função também é chamada pelo evento de clicar no botão da cor, esse if é para que só seja tocado o som se estiver acontecendo um jogo no momento
        if(element == blue) {
            audioAzul.play();
            return;
        } else if(element == red) {
            audioVermelho.play();
            return;
        } else if(element == green) {
            audioVerde.play();
            return;
        } else if(element == yellow) {
            audioAmarelo.play();
            return;
        }
    }
}

//Função que vai acender e apagar a cor que foi passada por parametro(a mesma no qual clicou pois ela só é chamada em eventos de click) e vai chamar a função de checar a ordem pra ver se clicou na cor correta
function click(color) {
    if(controlStartGame){ //Como essa função também é chamada pelo evento de clicar no botão da cor, esse if é para que só seja executada a função caso tenhao um jogo acontecendo no momento
        let cor = createColorElement(color)
        clickedOrder[clickedOrder.length] = color;
        cor.classList.add('selected');

        setTimeout(() => {
            createColorElement(color).classList.remove('selected');
            checkOrder();
        },250);
    }
}


//Função para checar se a ordem clicada pelo usuário é igual a ordem que foi mostrada pelo jogo
function checkOrder() {
    let controlOrderEqual; //O objetivo dessa variável é para quando o usuário errar na primeira fase, a condição do checkOrder de comparar o tamanho não retorne true, e dessa maneira exibir 1 ponto(que seria um erro)
    for(let i in clickedOrder) {
        if(clickedOrder[i] != order[i]) {
            gameOver();
            controlOrderEqual = false
            break;
        } else {
            controlOrderEqual = true; // Mesmo que por um momento a ControlOrderEqual se o usuário acertou apenas uma parte da sequência ficar true, quando o usuário errar ela vai retornar para false
        }
    }

    if(order.length == clickedOrder.length && controlOrderEqual) {
        nextLevel();
    }
}

//Função que vai mostrar a mensagem de gameOver e zerar os arrays que armazenam a ordem do jogo atual e o array da ordem clicada, juntamente com indicar pra variável de controle que não está mais acontecendo um jogo
function gameOver() {
    showMSG(msgLost, "Você perdeu! Clique em iniciar jogo para iniciar uma nova partida");
    order = [];
    clickedOrder = [];
    controlStartGame = false;

}

//Adicionando os eventos associados aos botões
green.addEventListener("click", function() {
    click(0);
    whichAudioToPlay(green);
});
red.addEventListener("click", function() {
    click(1);
    whichAudioToPlay(red)
});
yellow.addEventListener("click", function() {
    click(2);
    whichAudioToPlay(yellow);
});
blue.addEventListener("click", function() {
    click(3);
    whichAudioToPlay(blue)
});
start.addEventListener("click", playGame);
