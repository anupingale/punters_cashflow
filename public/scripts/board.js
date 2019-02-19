let game;

const closeOverlay = function(id) {
  let overlay = document.getElementById(id);
  overlay.style.visibility = "hidden";
};

const openFinancialStatement = function() {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const openCashLedger = function() {
  let fs = document.getElementById("cash_ledger");
  fs.style.visibility = "visible";
};

const displayFinancialStatement = function() {
  let container = document.getElementById("container");
  let parent = container.parentElement;
  parent.removeChild(container);
};

const getProfessionsDiv = function(player) {
  let { name, profession, turn } = player;
  let mainDiv = document.createElement("div");
  let container = document.getElementById("container");
  container.className = "container";

  mainDiv.className = "details";

  let p_name = document.createElement("div");
  p_name.innerText = name;

  let p_profession = document.createElement("div");
  p_profession.innerText = profession.profession;

  let p_turn = document.createElement("div");
  p_turn.innerText = turn;

  mainDiv.appendChild(p_name);
  mainDiv.appendChild(p_profession);
  mainDiv.appendChild(p_turn);
  container.appendChild(mainDiv);
  return mainDiv;
};

const getProfessions = function() {
  fetch("/getPlayerProfessions")
    .then(data => {
      return data.json();
    })
    .then(content => {
      let container = document.getElementById("container");
      content.map(getProfessionsDiv).join("");
      let button = document.createElement("button");
      button.innerText = "continue";
      button.onclick = displayFinancialStatement;
      container.appendChild(button);
    });
};

const enableDice = function(diceId) {
  const dice = document.getElementById(diceId);
  dice.hidden = false;
  dice.onclick = rollDie;
};

const activateDice = function(currentPlayer) {
  enableDice("dice1");
  if (currentPlayer.hasCharityTurn) {
    let askNumOfDice = document.getElementById("num_of_dices");
    askNumOfDice.style.visibility = "visible";
  }
};

const rollDie = function() {
  const dice = document.getElementById(event.target.id);
  fetch("/rolldie")
    .then(res => res.text())
    .then(number => {
      dice.innerText = number;
      dice.onclick = null;
    });
};

const polling = function(game) {
  let { currentPlayer, isMyTurn } = game;
  if (isMyTurn && currentPlayer.haveToActivateDice) {
    activateDice(currentPlayer);
  }
  if (currentPlayer.updateSpace) {
    let gamePiece = document.getElementById("gamePiece" + currentPlayer.turn);
    let space = gamePiece.parentNode;
    let newSpace = document.getElementById(currentPlayer.currentSpace);
    space.removeChild(gamePiece);
    newSpace.appendChild(gamePiece);
  }
};

const getGame = function() {
  fetch("/getgame")
    .then(data => {
      return data.json();
    })
    .then(content => {
      game = content;
    });
};

const initialize = function() {
  setInterval(getGame, 1000);
  getProfessions();
  let dice2 = document.getElementById("dice2");
  dice2.hidden = true;
};

window.onload = initialize;
