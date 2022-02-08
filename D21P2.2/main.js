import * as fs from 'fs/promises';
import { counts, winningScore } from './constants.js';
import Player from './Player.js';

// let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(entry => parseInt(entry.match(/Player [0-9]+ starting position: ([0-9]+)/)[1]));
let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(entry => parseInt(entry.match(/Player [0-9]+ starting position: ([0-9]+)/)[1]));

// console.log(inputData);

// console.log(counts);

let winCounts = { 1: 0, 2: 0 };

const player1 = new Player(1, inputData[0], 0, 1, 0, winCounts);
const player2 = new Player(2, inputData[1], 0, 1, 0, winCounts);
player1.setOpponents([player2]);
player2.setOpponents([player1]);
for (let turnNum = 1; turnNum <= 21; ++turnNum) {
  console.log({turnNum});
  player1.playTurn(turnNum);
  // player2.playTurn(turnNum);
}
console.log(winCounts);

// const player1WinAts = player1.returnWonAt();
// const player2WinAts = player2.returnWonAt();
// console.log('Player 1: ', player1WinAts);
// console.log('Player 2: ', player2WinAts);

// let player1Wins = 0;
// let player2Wins = 0;

// for (let turnNum of Object.keys(player1WinAts)) {
//   player1Wins += player1WinAts[turnNum];
//   player2Wins += player2WinAts[turnNum];
// }

// console.log(player1Wins, player2Wins);
// console.log(player1.children[0].children[0]);

// let rollNum = 0;
// let diceVal = 1;
// let scores = [0, 0];
// while (scores.every(val => val < 1000)) {
//   for (let player = 0; player < 2; ++player) {
//     for (let roll = 0; roll < 3; ++roll) {
//       // console.log(`${inputData[player]} + ${diceVal} => ${((inputData[player] + diceVal - 1) % 10 + 1)}`);
//       inputData[player] = ((inputData[player] + diceVal - 1) % 10) + 1;
//       diceVal++;
//       rollNum++;
//     }
//     scores[player] += inputData[player];
//     if (scores[0] >= 1000) break;
//   }
//   console.log(scores);
// }
// console.log(rollNum);
// console.log(scores);
// console.log(Math.min(...scores) * rollNum);
