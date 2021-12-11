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
let totalFlashes = 0;
for (let step = 0; step < 100; step++) {
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

  let flashCount = 0;
  for (let row of octoGrid) {
    for (let octopus of row) {
      flashCount += octopus.didFlash ? 1 : 0;
    }
  }
  totalFlashes += flashCount;
}

console.log({ totalFlashes });
