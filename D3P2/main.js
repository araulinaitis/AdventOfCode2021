import * as fs from 'fs/promises';

const inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n');

let count1 = Array(inputData[0].length).fill(0);
let count0 = Array(inputData[0].length).fill(0);
for (let row of inputData) {
  for (let [idx, char] of Array.from(row).entries()) {
    count1[idx] += char == 1 ? 1 : 0;
    count0[idx] += char == 0 ? 1 : 0;
  }
}
const mostCommonValue = count1.map((colSum, index) => colSum >= count0[index] ? 1 : 0);
const gammaRate = binArrToDec(mostCommonValue);
const leastCommonValue = count1.map((colSum, index) => colSum < count0[index] ? 1 : 0);
const epsilonRate = binArrToDec(leastCommonValue);
console.log({ count1, count0, mostCommonValue, gammaRate, leastCommonValue, epsilonRate, powerConsumption: gammaRate * epsilonRate });

let oxygenRate, CO2Rate;
{
  let filterIdx = 0;
  let filterArr = JSON.parse(JSON.stringify(inputData));
  while (filterArr.length > 1) {
    let count1 = Array(filterArr[0].length).fill(0);
    let count0 = Array(filterArr[0].length).fill(0);
    for (let row of filterArr) {
      for (let [idx, char] of Array.from(row).entries()) {
        count1[idx] += char == 1 ? 1 : 0;
        count0[idx] += char == 0 ? 1 : 0;
      }
    }
    const mostCommonValue = count1.map((colSum, index) => colSum >= count0[index] ? 1 : 0);

    filterArr = filterArr.filter(num => num.charAt(filterIdx) == mostCommonValue[filterIdx]);
    filterIdx++;
    if (filterIdx > filterArr[0].length) break;
  }
  oxygenRate = filterArr[0];
  console.info({ oxygenRate });
}

{
  let filterIdx = 0;
  let filterArr = JSON.parse(JSON.stringify(inputData));
  while (filterArr.length > 1) {

    let count1 = Array(filterArr[0].length).fill(0);
    let count0 = Array(filterArr[0].length).fill(0);
    for (let row of filterArr) {
      for (let [idx, char] of Array.from(row).entries()) {
        count1[idx] += char == 1 ? 1 : 0;
        count0[idx] += char == 0 ? 1 : 0;
      }
    }
    const leastCommonValue = count1.map((colSum, index) => colSum < count0[index] ? 1 : 0);

    filterArr = filterArr.filter(num => num.charAt(filterIdx) == leastCommonValue[filterIdx]);
    filterIdx++;
    if (filterIdx > filterArr[0].length) break;
  }
  CO2Rate = filterArr[0];
  console.info({ CO2Rate });
}

oxygenRate = binArrToDec(Array.from(oxygenRate));
CO2Rate = binArrToDec(Array.from(CO2Rate));

console.log({ oxygenRate, CO2Rate, lifeSupportRate: oxygenRate * CO2Rate });

function binArrToDec(arr) {
  let place = 0;
  let sum = 0;
  for (let idx = arr.length - 1; idx >= 0; --idx) {
    sum += arr[idx] == 1 ? Math.pow(2, place) : 0;
    place++;
  }
  return sum;
}
