import * as fs from 'fs/promises';
import Board from './Board.js';

const inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n\r\n').map(subEntry => subEntry.split('\r\n'));
// const inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n\r\n').map(subEntry => subEntry.split('\r\n'));

const numberStream = inputData[0][0].split(',').map(val => parseInt(val));
const boards = inputData.splice(1, inputData.length - 1);

const boardArr = boards.map(board => new Board(board));

let lastWinningBoard;
let lastWinningStep;

for (let step of numberStream) {
  for (let board of boardArr) {
    board.step(step);
    if (board.checkWin()) {
      lastWinningBoard = board;
      lastWinningStep = step;
    }
  }
}

console.log(lastWinningStep, lastWinningBoard.calculateInactiveValue());
const winningVal = lastWinningStep * lastWinningBoard.calculateInactiveValue();
console.log(winningVal);
