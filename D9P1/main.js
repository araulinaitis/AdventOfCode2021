import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// console.log(inputData);

let minSum = 0;
for (let [rowIdx, row] of inputData.entries()) {
  let flag = false;
  for (let [colIdx, val] of row.entries()) {
    if (isLocalMin(inputData, rowIdx, colIdx)) {
      minSum += val + 1;
      flag = true;
    }
  }
}

console.log(minSum);

function isLocalMin(grid, rowIdx, colIdx) {
  const thisVal = grid[rowIdx][colIdx];
  if (rowIdx > 0) {
    // check cell above
    if (grid[rowIdx - 1][colIdx] <= thisVal) return false;
  }

  if (rowIdx < grid.length - 1) {
    // check cell below
    if (grid[rowIdx + 1][colIdx] <= thisVal) return false;
  }

  if (colIdx > 0) {
    // check cell left
    if (grid[rowIdx][colIdx - 1] <= thisVal) return false;
  }

  if (colIdx < grid[0].length - 1) {
    // check cell right
    if (grid[rowIdx][colIdx + 1] <= thisVal) return false;
  }
  
  return true;
}
