import * as fs from 'fs/promises';
import Prism from './Prism.js';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

// console.log(inputData);

let prisms = [];
for (let row of inputData) {
  let coords = row[1].split(',').map(coord => coord.split('..').map(entry => parseInt(entry.replace(/[a-z]=/, ''))));
  prisms.push(new Prism(coords[0][0], coords[1][0], coords[2][0], coords[0][1], coords[1][1], coords[2][1], row[0]));
}
// console.log(steps[0]);

let newPrisms = [prisms[0]];
for (let stepIdx = 1; stepIdx < prisms.length; ++stepIdx) {
  console.log({ stepIdx });
  const cuttingPrism = prisms[stepIdx];
  let newPrismIdx = 0;
  while (newPrismIdx < newPrisms.length) {
    const newNewPrisms = newPrisms[newPrismIdx].intersect(cuttingPrism);
    newPrisms.splice(newPrismIdx, 1, ...newNewPrisms);
    newPrismIdx += newNewPrisms.length;
  }
  if (cuttingPrism.state) {
    newPrisms.push(cuttingPrism);
  }
  // newPrisms.push(cuttingPrism);
}

let totalVolume = 0;
for(let prism of newPrisms) {
  totalVolume += prism.calculateVolume();
}
console.log({totalVolume});

const files = await fs.readdir('.');
const filesToDelete = files.filter(file => file.match(/test_[0-9]+/));

for(let file of filesToDelete) {
  fs.unlink(file);
}

let globalPointArr = [];
let globalPointIdx = 1;
for (let prism of newPrisms) {
  globalPointIdx = prism.assignGlobalPoints(globalPointArr, globalPointIdx);
}

// for (let [idx, prism] of newPrisms.entries()) {
//   const obj = prism.printAsObjSolo(idx);
//   fs.writeFile(`test_${idx}.obj`, obj);
// }

let obj = '';
for (let pt of globalPointArr) {
  obj += `v ${pt.isMinX ? pt.x - 0.5 : pt.x + 0.5} ${pt.isMinY ? pt.y - 0.5 : pt.y + 0.5} ${pt.isMinZ ? pt.z - 0.5 : pt.z + 0.5}\n`;
}
for(let prism of newPrisms) {
  obj += prism.printAsObj();
}

fs.writeFile('test.obj', obj);
