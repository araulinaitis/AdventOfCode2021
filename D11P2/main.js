import * as fs from 'fs/promises';
import Octopus from './Octopus.js';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// console.log(inputData);

let octoGrid = [];
// build grid
for (let [rowIdx, row] of inputData.entries()) {
  octoGrid[rowIdx] = [];
  for (let [colIdx, val] of row.entries()) {
    octoGrid[rowIdx][colIdx] = new Octopus(rowIdx, colIdx, val);
  }
}

// set neighbors. Could be combined to above but oh well
for (let row of octoGrid) {
  for (let octopus of row) {
    octopus.addNeighbors(octoGrid);
  }
}

// do main loop stepping stuff
let step = 0;
while (true) {
  // rest flash flags
  for (let row of octoGrid) {
    for (let octopus of row) {
      octopus.didFlash = false;
    }
  }

  for (let row of octoGrid) {
    for (let octopus of row) {
      octopus.step();
    }
  }

  let allFlashed = true;
  for (let row of octoGrid) {
    for (let octopus of row) {
      if (!octopus.didFlash) {
        allFlashed = false;
        break;
      };
    }
    if (!allFlashed) break;
  }
  step++;
  if (allFlashed) {
    console.log(step);
    break;
  }
}

