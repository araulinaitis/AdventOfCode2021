import { counts } from './constants.js';

export default class Player {
  constructor(position, score = 0, count = 1, turnNum = 0) {
    this.pos = position;
    this.count = count;
    this.score = score;
    this.children = [];
    this.wonAt = this.score >= 1 ? turnNum : null;
    this.opponent = null;
    this.didLose = false;
  }
  
  setOpponent(opponent) {
    this.opponent = opponent;
  }

  playTurn(turnNum) {
    if (this.wonAt) return;
    if (this.children.length) {
      for (let child of this.children) {
        child.playTurn(turnNum);
      }
    } else {
      for (let [offset, count] of Object.entries(counts)) {
        offset = parseInt(offset);
        const newPos = ((this.pos + offset - 1) % 10) + 1;
        this.children.push(new Player(newPos, this.score + newPos, this.count * count, turnNum));
      }
    }
  }

  splitForOtherTurn() {
    // copy this one 3 times for the 3 universes created by the other player
    if (this.children.length) {
      for (let child of this.children) {
        child.splitForOtherTurn();
      }
    } else if (!this.wonAt) {
      this.count *= 3;
    }
  }

  returnWonAt() {
    let winCounts = {};
    if (this.children.length) {
      for (let child of this.children) {
        const thisWinCount = child.returnWonAt();
        for (let [turnNum, count] of Object.entries(thisWinCount)) {
          if (!winCounts[turnNum]) winCounts[turnNum] = 0;
          winCounts[turnNum] += count;
        }
      }
    } else {
      if (this.wonAt) {
        winCounts[this.wonAt] = this.count;
      }
    }
    return winCounts;
  }
}
