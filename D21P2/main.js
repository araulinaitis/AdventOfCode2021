import * as fs from 'fs/promises';
import Player from './Player.js';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(entry => parseInt(entry.match(/Player [0-9]+ starting position: ([0-9]+)/)[1]));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(entry => parseInt(entry.match(/Player [0-9]+ starting position: ([0-9]+)/)[1]));

// console.log(inputData);
// console.log(counts);

let winCounts = { 1: 0, 2: 0 };

const player1 = new Player(1, inputData[0], 0, 1, 0);
const player2 = new Player(2, inputData[1], 0, 1, 0);
player1.setOpponent(player2);
player2.setOpponent(player1);
let player1s = [player1];
for (let turnNum = 1; turnNum <= 21; ++turnNum) {
  if (player1s.length === 0) break;
  console.log({ turnNum });
  let newPlayer1s = [];

  for (let player1 of player1s) {
    newPlayer1s = [...newPlayer1s, ...player1.playTurn(turnNum)];
  }

  console.log(newPlayer1s.length);
  let combinedPlayer1s = [];
  for (let newPlayer1 of newPlayer1s) {
    if (newPlayer1.wonAt) {
      winCounts[1] += newPlayer1.count;
    } else if (newPlayer1.didLose) {
      winCounts[2] += newPlayer1.opponent.count;
    } else {
      let found = false;
      for (let combinedPlayer1 of combinedPlayer1s) {
        if (
          combinedPlayer1.pos === newPlayer1.pos &&
          combinedPlayer1.score === newPlayer1.score &&
          combinedPlayer1.opponent.pos === newPlayer1.opponent.pos &&
          combinedPlayer1.opponent.score === newPlayer1.opponent.score
        ) {
          combinedPlayer1.count += newPlayer1.count;
          combinedPlayer1.opponent.count += newPlayer1.opponent.count;
          found = true;
          break;
        }
      }
      if (!found && !newPlayer1.wonAt && !newPlayer1.didLose) {
        combinedPlayer1s.push(newPlayer1);
      }
    }
  }
  player1s = combinedPlayer1s;
  console.log(player1s.length);
  console.log({ winCounts });
}
console.log(winCounts);
