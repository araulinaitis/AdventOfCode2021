import * as fs from 'fs/promises';
import BoardManager from './BoardManager.js';
import GamePiece from './GamePiece.js';

// let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(''));

console.log(inputData);

function makeGameObject(value) {
  if (value === '#') return 'wall';
  if (value === '.') return 'space';
  if (['A', 'B', 'C', 'D'].includes(value)) return 'space';
  if(value === ' ') return null;
}

// const boardManager = new BoardManager(board);

function makeGamePiece(value, rowIdx, colIdx) {
  if (['A', 'B', 'C', 'D'].includes(value)) return new GamePiece(value, rowIdx, colIdx, board);
}

let board = [];
let gamePieces = [];
for(let [rowIdx, row] of inputData.entries()) {
  if(!board[rowIdx]) board[rowIdx] = [];
  for (let [colIdx, value] of row.entries()) {
    board[rowIdx][colIdx] = makeGameObject(value);
    const gamePiece = makeGamePiece(value, rowIdx, colIdx);
    if (gamePiece) gamePieces.push(gamePiece);
  }
}

console.log(board);
console.log(gamePieces);
