import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).replace('\r\n', '').split(',').map(val => parseInt(val));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).replace('\r\n', '').split(',').map(val => parseInt(val));

console.log(inputData);

let day = 0;
const targetDay = 80;
while (day < targetDay) {
  let newFish = [];
  for (let val of inputData) {
    if (val == 0) newFish.push(8);
  }
  inputData = inputData.map(val => val - 1).map(val => val < 0 ? 6 : val);
  inputData = [...inputData, ...newFish];
  console.log(inputData);
  day++;
}

console.log(inputData.length);