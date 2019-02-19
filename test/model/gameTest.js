const Game = require("../../src/model/game");
const Player = require("../../src/model/player");
const { expect } = require("chai");

describe("Game", function() {
  describe("addPlayer", function() {
    it("should add the given player to game.players", function() {
      const player = { name: "player" };
      const cards = { bigdeals: [], smallDeals: [] };
      const game = new Game(cards);
      game.addPlayer(player);

      expect(game)
        .to.have.property("players")
        .to.be.an("Array")
        .to.deep.equals([{ name: "player" }]);
    });
  });
  describe("getPlayerNames", function() {
    it("should return the list of player names in the game ", function() {
      const player1 = { name: "player1" };
      const player2 = { name: "player2" };
      const cards = { bigdeals: [], smallDeals: [] };
      const game = new Game(cards);
      game.addPlayer(player1);
      game.addPlayer(player2);

      const actualOutput = game.getPlayerNames();
      const expectedOutput = ["player1", "player2"];
      expect(actualOutput).to.deep.equals(expectedOutput);
    });
  });
  describe("nextPlayer", function() {
    it("should change current player to next player", function() {
      const player1 = new Player("player1");
      player1.setTurn(1);
      const player2 = new Player("player2");
      player2.setTurn(2);
      const cards = { bigdeals: [], smallDeals: [] };
      const game = new Game(cards);
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.setCurrentPlayer(player1);
      game.nextPlayer();
      expect(game.currentPlayer).to.deep.equal(player2);
    });
  });
});

describe("getInitialDetails", function() {
  it("should assign the turn and profession to player ", function() {
    const player1 = { name: "player1" };
    const player2 = { name: "player2" };
    const cards = { professions: { cards: ["doctor"], usedCard: () => {} } };
    const game = new Game(cards);
    game.addPlayer(player1);
    game.addPlayer(player2);

    game.getInitialDetails();
    expect(game.players[0]).has.property("turn");
    expect(game.players[0]).has.property("profession");
  });
});
