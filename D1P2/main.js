import * as fs from 'fs/promises';

const inputData = (await fs.readFile('./data/input.csv', {encoding: 'UTF-8'})).split('\r\n').map(value => parseInt(value));
let count = 0;
for (let idx = 1; idx < inputData.length - 2; ++idx) {
  const firstSum = [idx - 1, idx, idx + 1].map(idx => inputData[idx]).reduce((prevValue, newValue) => prevValue + newValue);
  const secondSum = [idx, idx + 1, idx + 2].map(idx => inputData[idx]).reduce((prevValue, newValue) => prevValue + newValue);
  if (secondSum > firstSum) count++;
}

console.info(count);