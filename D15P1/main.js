import * as fs from 'fs/promises';
import Cell from './Cell.js';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// console.log(inputData);

let grid = [];
for (let [rowIdx, row] of inputData.entries()) {
  let newRow = [];
  for (let colIdx of row.keys()) {
    newRow.push(new Cell(inputData, rowIdx, colIdx));
  }
  grid.push(newRow);
}

for (let row of grid) {
  for (let cell of row) {
    cell.populateAdjacents(grid);
  }
}

let allDone = false;
while (!allDone) {
  allDone = true;
  for (let row of grid) {
    for (let cell of row) {
      if (!cell.bestPath) allDone = false;
      cell.findBestPath();
    }
  }
}
console.log(grid[0][0].bestPath.risk);
