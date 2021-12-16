
import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');
// console.log(inputData);

let startingString = inputData.splice(0, 1)[0];

// set up frequencies
let pairCounts = {};

let rules = Object.fromEntries(inputData.splice(0, inputData.length).map(rule => rule.split(' -> ')));

let polymerMap = {};

// pull out all possible character combos from the keys of rules
for (let [ruleName, rule] of Object.entries(rules)) {
  polymerMap[ruleName] = [ruleName.charAt(0) + rule, rule + ruleName.charAt(1)];
  pairCounts[ruleName] = 0;
}

// initial counts
for (let idx = 0; idx < startingString.length - 1; ++idx) {
  const thisPair = startingString.slice(idx, idx + 2);
  pairCounts[thisPair]++;
}

for (let idx = 0; idx < 40; ++idx) {
  let newPairCounts = {};
  for (let [pair, derivatives] of Object.entries(polymerMap)) {
    for (let derivative of derivatives) {
      if (newPairCounts[derivative] === undefined) newPairCounts[derivative] = 0;
      newPairCounts[derivative] += pairCounts?.[pair] ?? 0;
    }
  }
  pairCounts = newPairCounts;
}

// convert freqs to counts
let counts = {};
for (let [name, val] of Object.entries(pairCounts)) {
  if (!counts[name.charAt(1)]) counts[name.charAt(1)] = 0;
  counts[name.charAt(1)] += val;
}
counts[startingString.charAt(0)]++;

console.log(counts);
console.log(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)));