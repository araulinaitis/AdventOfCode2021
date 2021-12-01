import * as fs from 'fs/promises';

const inputData = (await fs.readFile('./data/input.csv', {encoding: 'UTF-8'})).split('\r\n');
let count = 0;
for (let idx = 1; idx < inputData.length; ++idx) {
  if (parseInt(inputData[idx]) > parseInt(inputData[idx - 1])) count++;
}

console.info(count);