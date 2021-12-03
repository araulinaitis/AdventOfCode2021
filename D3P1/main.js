import * as fs from 'fs/promises';

const inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n');

let count1 = Array(12).fill(0);
let count0 = Array(12).fill(0);
for (let row of inputData){
  for (let [idx, char] of Array.from(row).entries()) {
    count1[idx] += char == 1 ? 1 : 0;
    count0[idx] += char == 0 ? 1 : 0;
  }
}
const gammaRateArr = count1.map((colSum, index) => colSum > count0[index] ? 1 : 0);
const gammaRate = binArrToDec(gammaRateArr);
const epsilonRateArr = count1.map((colSum, index) => colSum < count0[index] ? 1 : 0);
const epsilonRate = binArrToDec(epsilonRateArr);
console.log({count1, count0, gammaRate, epsilonRate, powerConsumption: gammaRate * epsilonRate});

function binArrToDec(arr) {
  let place = 0;
  let sum = 0;
  for (let idx = arr.length - 1; idx >= 0; --idx) {
    sum += arr[idx] == 1 ? Math.pow(2, place) : 0;
    place++;
  }
  return sum;
}
