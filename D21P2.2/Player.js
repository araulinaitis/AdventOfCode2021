import { counts, winningScore } from './constants.js';

export default class Player {
  constructor(playerKey, position, score = 0, count = 1, turnNum = 0, globalWinCounts) {
    this.pos = position;
    this.count = count;
    this.score = score;
    this.children = [];
    this.wonAt = this.score >= winningScore ? turnNum : null;
    this.opponents = [];
    this.didLose = false;
    this.playerKey = playerKey;
    globalWinCounts[playerKey] += this.wonAt ? this.count : 0;
    this.globalWinCounts = globalWinCounts;
    // if (turnNum) {
    //   if (this.wonAt) {
    //     console.log(`${this.count} Player ${this.playerKey} won on turn ${turnNum} with score ${this.score}`);
    //   } else {
    //     console.log(`${this.count} Player ${this.playerKey} did not win on turn ${turnNum} with score ${this.score}`);
    //   }
    // }
  }

  setOpponents(opponents) {
    this.opponents = opponents;
  }

  copy() {
    const newPlayer = new Player(this.playerKey, this.pos, this.score, this.count, null, this.globalWinCounts);
    newPlayer.didLose = this.didLose;
    newPlayer.wonAt = this.wonAt;
    return newPlayer;
  }

  playTurn(turnNum) {
    // console.log({turnNum, playerKey: this.playerKey, score: this.score, count: this.count, didLose: this.didLose, didWin: this.wonAt ? true : false, numChildren: this.children.length});
    if (this.wonAt || this.didLose) return;
    if (this.children.length) {
      for (let child of this.children) {
        child.playTurn(turnNum);
      }
    } else {
      for (let [offset, count] of Object.entries(counts)) {
        offset = parseInt(offset);
        const newPos = ((this.pos + offset - 1) % 10) + 1;
        const newChild = new Player(this.playerKey, newPos, this.score + newPos, this.count * count, turnNum, this.globalWinCounts);
        this.children.push(newChild);
        newChild.playTurnAsChild(turnNum, this.opponents);
      }
      this.didLose = !this.wonAt && this.opponents.every(opponent => opponent.wonAt); // not sure if needed, it probably is though
    }
  }
  
  playTurnAsChild(turnNum, opponents) {
    if (this.wonAt || this.didLose) return;
    let newUniverses = 0; // how many parallel universes created by opponents that don't win 
    let deadUniverses = 0;
    for (let opponent of opponents) {
      const newOpponent = opponent.copy();
      newOpponent.count *= this.count;
      // newOpponent.setOpponents([this]);
      // newUniverses += newOpponent.playTurnAsOpponent(turnNum);
      newOpponent.playTurnAsOpponent(turnNum);
      newUniverses += newOpponent.children.filter(child => !child.wonAt).map(child => child.count).reduce((prev, cur) => prev + cur, 0);
      deadUniverses += newOpponent.children.filter(child => child.wonAt).map(child => child.count).reduce((prev, cur) => prev + cur, 0);
      this.opponents = [];
      for (let childOpp of newOpponent.children) {
         this.opponents.push(childOpp);
      }
    }

    this.didLose = this.opponents.every(opponent => opponent.wonAt);
    this.count *= newUniverses;
  }

  playTurnAsOpponent(turnNum) {
    for (let [offset, count] of Object.entries(counts)) {
      offset = parseInt(offset);
      const newPos = ((this.pos + offset - 1) % 10) + 1;
      const newChild = new Player(this.playerKey, newPos, this.score + newPos, this.count * count, turnNum, this.globalWinCounts);
      
      // if (newChild.wonAt) {
      //   // win was already recorded in the constructor
      //   // console.log(`${newChild.count} Player ${newChild.playerKey} with score ${newChild.score} on turn ${turnNum}`);
      // }
      this.children.push(newChild);
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
