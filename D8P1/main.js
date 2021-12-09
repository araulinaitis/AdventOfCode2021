import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' | ').map(partition => partition.split(' ')));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' | ').map(partition => partition.split(' ')));
console.log(inputData);

const uniqueLengths = [2, 3, 4, 7];

let count = 0;
for (let row of inputData) {
  const output = row[1];
  count += output.map(entry => entry.length).filter(entry => uniqueLengths.includes(entry)).length;
}

console.log(count);
