import * as fs from 'fs/promises';
import Cell from './Cell.js';

// let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
let inputData = (await fs.readFile('./data/testData2.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// console.log(inputData);

let startGrid = [];
for (let [rowIdx, row] of inputData.entries()) {
  let newRow = [];
  for (let colIdx of row.keys()) {
    newRow.push(new Cell(inputData, rowIdx, colIdx));
  }
  startGrid.push(newRow);
}

const numRows = startGrid.length;
const numCols = startGrid[0].length;
console.log({ numRows, numCols });
const expansion = 5;

let grid = [];
for (let rowLoop = 0; rowLoop < expansion; ++rowLoop) {
  for (let row of startGrid) {
    let newRow = [];
    for (let colLoop = 0; colLoop < expansion; ++colLoop) {
      for (let cell of row) {
        newRow.push(cell.expandGrid(rowLoop, colLoop, numRows, numCols));
      }
    }
    grid.push(newRow);
  }
}

grid[grid.length - 1][grid[0].length - 1].isEnd = true;
grid[0][0].risk = 0;

for (let row of grid) {
  for (let cell of row) {
    cell.populateAdjacents(grid);
  }
}

// build diagonals
let diags = [];
for (let [rowIdx, row] of grid.entries()) {
  for (let [colIdx, cell] of row.entries()) {
    const diagNum = grid[rowIdx].length - 1 - colIdx + grid.length - 1 - rowIdx;
    if (!diags[diagNum]) diags[diagNum] = [];
    diags[diagNum].push(cell);
  }
}

let allDone = false;
while (!allDone) {
  allDone = true;
  for (let diag of diags) {
    for (let cell of diag) {
      if (!cell.bestPath) allDone = false;
      cell.findBestPath();
    }
  }
  console.log('cells with best path: ', grid.map(row => row.map(cell => (cell.bestPath ? 1 : 0)).reduce((prev, cur) => prev + cur)).reduce((prev, cur) => prev + cur));
}

// let allDone = false;
// while (!allDone) {
//   allDone = true;
//   for (let row of grid) {
//     for (let cell of row) {
//       if (!cell.bestPath) allDone = false;
//       cell.findBestPath();
//     }
//   }
//   console.log('cells with best path: ', grid.map(row => row.map(cell => (cell.bestPath ? 1 : 0)).reduce((prev, cur) => prev + cur)).reduce((prev, cur) => prev + cur));
// }

console.log(grid[0][0].bestPath.risk);

// verify best paths by searching around the cell
let allVerified = false;
while (!allVerified) {
  allVerified = true;
  for (let row of grid) {
    for (let cell of row) {
      // if (!cell.trueBestPath) allVerified = false;
      const stayedSame = cell.verifyBestPath();
      allVerified = stayedSame && allVerified;
    }
  }
  console.log('cells with verified best path: ', grid.map(row => row.map(cell => (cell.trueBestPath ? 1 : 0)).reduce((prev, cur) => prev + cur)).reduce((prev, cur) => prev + cur));
}

console.log(grid[0][0].bestPath.risk);
