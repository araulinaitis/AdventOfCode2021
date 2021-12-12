import * as fs from 'fs/promises';
import Cave from './Cave.js';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('-'));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('-'));
// console.log(inputData);

// set up caves
let caves = {};
for (let row of inputData) {
  for (let cave of row) {
    caves[cave] = caves[cave] ?? new Cave(cave);
  }
}

// set up links.  This could be mixed above, but this is easier. oh well
for (let row of inputData) {
  caves[row[0]].addLink(caves[row[1]]);
  caves[row[1]].addLink(caves[row[0]]);
}

// for (let cave of Object.values(caves)) {
//   console.log(cave)
// }

const startCave = caves['start'];
// build paths
let paths = [];

paths = startCave.expandPath(paths);

console.log(paths.filter(path => path[path.length - 1].name === 'end').length);
