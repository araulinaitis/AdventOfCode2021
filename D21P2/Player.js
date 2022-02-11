import { winningScore } from './constants.js';

export default class Player {
  constructor(playerKey, position, score = 0, count = 1, turnNum = 0) {
    this.pos = position;
    this.count = count;
    this.score = score;
    this.children = [];
    this.wonAt = this.score >= winningScore ? turnNum : null;
    this.opponent = null;
    this.didLose = false;
    this.playerKey = playerKey;
  }

  setOpponent(opponent) {
    this.opponent = opponent;
  }

  copy() {
    const newPlayer = new Player(this.playerKey, this.pos, 0, this.count, null, this.globalWinCounts, true);
    newPlayer.score = this.score;
    newPlayer.didLose = this.didLose;
    newPlayer.wonAt = this.wonAt;
    return newPlayer;
  }

  playTurn(turnNum, isOpponent = false) {
    let newChildren = [this];
    for (let roll = 0; roll < 3; ++roll) {
      let newNewChildren = [];
      for (let diceVal = 1; diceVal <= 3; ++diceVal) {
        for (let newChild of newChildren) {
          const newPos = ((newChild.pos + diceVal - 1) % 10) + 1;
          const newPlayer = new Player(newChild.playerKey, newPos, this.score + newPos, newChild.count, turnNum, newChild.globalWinCounts);
          newPlayer.opponent = newChild.opponent.copy();
          newPlayer.opponent.opponent = newPlayer;
          newNewChildren.push(newPlayer);
        }
      }
      newChildren = newNewChildren;
    }

    if (!isOpponent) {
      let newNewChildren = [];
      for (let newChild of newChildren) {
        if (newChild.wonAt) {
          newNewChildren.push(newChild);
        } else {
          const newOpponents = newChild.opponent.playTurn(turnNum, true);
          for (let newOpponent of newOpponents) {
            const thisNewChild = newChild.copy();
            if (newOpponent.wonAt) thisNewChild.didLose = true;
            thisNewChild.opponent = newOpponent;
            newOpponent.opponent = thisNewChild;
            newNewChildren.push(thisNewChild);
          }
        }
      }
      newChildren = newNewChildren;
    }

    return newChildren;
  }
}
