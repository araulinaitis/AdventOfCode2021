import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).replace('\r\n', '').split(',').map(val => parseInt(val));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).replace('\r\n', '').split(',').map(val => parseInt(val));
console.log(inputData);

const minPos = Math.min(...inputData);
const maxPos = Math.max(...inputData);

let bestPos
let bestVal = Infinity;

for (let pos = minPos; pos <= maxPos; pos++) {
  const thisVal = inputData.map(val => Math.abs(val - pos)).reduce((prev, cur) => prev + cur);
  if (thisVal < bestVal) {
    bestVal = thisVal;
    bestPos = pos;
  }
}
console.log({bestPos, bestVal});