const lodash = require("lodash");
const Board = require("./board");
const { range, assignId } = require("../utils/array.js");
const { getNextNum, isBetween } = require("../utils/utils.js");

class ActivityLog {
  constructor() {
    this.activityLog = [];
  }
  addActivity(msg, playerName = "") {
    const time = new Date();
    this.activityLog.unshift({ playerName, msg, time });
  }
}

class Game extends ActivityLog {
  constructor(cardStore, host) {
    super();
    this.board = new Board();
    this.host = host;
    this.cardStore = cardStore;
    this.currentPlayer;
    this.players = [];
    this.hasStarted = false;
    this.financialStatement;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayerNames() {
    return this.players.map(player => player.name);
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  getInitialDetails() {
    const ids = range(1, this.players.length);
    lodash.zip(this.players, ids).map(assignId);
    this.players.map(player => this.getProfession(player));
    this.currentPlayer = this.players[0];
    this.addActivity("Game has Started");
    this.addActivity("'s turn", this.currentPlayer.name);
    this.currentPlayer.haveToActivateDice = true;
  }

  getProfession(player) {
    let { professions } = this.cardStore;
    const profession = professions.drawCard();
    player.profession = profession;
    player.setFinancialStatement(profession);
  }

  getPlayer(turn) {
    return this.players[turn - 1];
  }

  getTotalPlayers() {
    return this.players.length;
  }

  startGame() {
    this.hasStarted = true;
  }

  getPlayersCount() {
    return this.players.length;
  }

  isPlaceAvailable() {
    const playersCount = this.getPlayersCount();
    return playersCount < 6;
  }

  nextPlayer() {
    const currTurn = this.currentPlayer.getTurn();
    const nextPlayerTurn = getNextNum(currTurn, this.getTotalPlayers());
    const nextPlayer = this.getPlayer(nextPlayerTurn);
    this.currentPlayer = nextPlayer;
    this.addActivity("'s turn ", this.currentPlayer.name);
    this.currentPlayer.haveToActivateDice = true;
  }

  handleBabySpace() {
    this.currentPlayer.addBaby();
    this.addActivity(` got a baby`, this.currentPlayer.name);
  }

  handleDoodadSpace() {
    let doodad = this.cardStore.doodads.drawCard();
    this.activeCard = { type: "doodad", data: doodad };
    const { expenseAmount } = doodad;
    this.currentPlayer.profession.assets.savings -= expenseAmount;
    let { name } = this.currentPlayer;
    const doodadMsg = `${expenseAmount} is deducted from ${name} for doodad`;
    this.addActivity(doodadMsg);
  }

  handleSpace(oldSpaceNo) {
    const handlers = {
      baby: this.handleBabySpace.bind(this),
      doodad: this.handleDoodadSpace.bind(this)
    };
    const currentPlayer = this.currentPlayer;
    this.handleCrossedPayDay(oldSpaceNo);
    const currentSpaceType = this.board.getSpaceType(
      currentPlayer.currentSpace
    );
    this.addActivity(` lands on ${currentSpaceType}`, currentPlayer.name);
    handlers[currentSpaceType] && handlers[currentSpaceType]();
    this.nextPlayer();
  }

  handleCrossedPayDay(oldSpaceNo) {
    const paydaySpaces = this.board.getPayDaySpaces();
    const crossedPaydays = paydaySpaces.filter(paydaySpace =>
      isBetween(oldSpaceNo, this.currentPlayer.currentSpace, paydaySpace)
    );
    if (crossedPaydays.length > 0) {
      crossedPaydays.forEach(() => {
        this.addActivity(" crossed payday", this.currentPlayer.name);
        this.currentPlayer.addPayday();
      });
    }
  }
}

module.exports = Game;
