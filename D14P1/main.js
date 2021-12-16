import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');
// console.log(inputData);

let chemicalString = inputData.splice(0, 1)[0];

let rules = Object.fromEntries(inputData.splice(0, inputData.length).map(rule => rule.split(' -> ')));

for (let step = 0; step < 5; ++step) {
  let newString = '';
  for (let idx = 0; idx < chemicalString.length - 1; ++idx) {
    const thisPair = chemicalString.slice(idx, idx + 2);
    newString += insert(thisPair, rules[thisPair]);
  }
  newString += chemicalString[chemicalString.length - 1];
  chemicalString = newString;
}

// get frequencies
let freqs = {};
for (let char of chemicalString.split('')) {
  if (!freqs[char]) freqs[char] = 0;
  freqs[char]++;
}

console.log(chemicalString.length);
console.log(Math.max(...Object.values(freqs)) - Math.min(...Object.values(freqs)));

function insert(doublet, char) {
  return doublet[0] + char;
}
