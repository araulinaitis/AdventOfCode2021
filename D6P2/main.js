import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).replace('\r\n', '').split(',').map(val => parseInt(val));
// let inputData =(await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' }))
//     .replace('\r\n', '')
//     .split(',')
//     .map(val => parseInt(val));

let counts = Object.fromEntries([0, 1, 2, 3, 4, 5, 6, 7, 8].map(key => [key, 0]));

for (let val of inputData) {
  counts[val]++;
}

for (let day = 0; day < 256; ++day) {
  const newFish = 0 + counts[0];
  counts[0] = 0 + counts[1];
  counts[1] = 0 + counts[2];
  counts[2] = 0 + counts[3];
  counts[3] = 0 + counts[4];
  counts[4] = 0 + counts[5];
  counts[5] = 0 + counts[6];
  counts[6] = newFish + counts[7]
  counts[7] = 0 + counts[8];
  counts[8] = newFish;
}
console.log(counts);

console.log(Object.values(counts).reduce((prevVal, curVal) => prevVal + curVal))