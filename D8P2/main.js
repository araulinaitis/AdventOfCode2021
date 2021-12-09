import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' | ').map(partition => partition.split(' ')));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' | ').map(partition => partition.split(' ')));
// console.log(inputData);

const rules = {
  0: {
    length: 6,
    overlap: [
      { digit: 1, overlap: 2 },
      { digit: 4, overlap: 3 },
      { digit: 7, overlap: 3 },
    ],
  },
  2: {
    length: 5,
    overlap: [
      { digit: 1, overlap: 1 },
      { digit: 4, overlap: 2 },
      { digit: 7, overlap: 2 },
    ],
  },
  3: {
    length: 5,
    overlap: [
      { digit: 1, overlap: 2 },
      { digit: 4, overlap: 3 },
      { digit: 7, overlap: 3 },
    ],
  },
  5: {
    length: 5,
    overlap: [
      { digit: 1, overlap: 1 },
      { digit: 4, overlap: 3 },
      { digit: 7, overlap: 2 },
    ],
  },
  6: {
    length: 6,
    overlap: [
      { digit: 1, overlap: 1 },
      { digit: 4, overlap: 3 },
      { digit: 7, overlap: 2 },
    ],
  },
  9: {
    length: 6,
    overlap: [
      { digit: 1, overlap: 2 },
      { digit: 4, overlap: 4 },
      { digit: 7, overlap: 3 },
    ],
  },
};

let totalVal = 0;
for (let row of inputData) {
  const signals = row[0];
  const sortedSignals = signals.map(entry =>
    entry
      .split('')
      .sort((letter1, letter2) => {
        if (letter1 === letter2) return 0;
        return letter1 < letter2 ? -1 : 1;
      })
      .join('')
  );
  // const sortedSignals = signals;

  // predefine unique numbers based on this row's letter jumble
  const digitMap = {
    1: sortedSignals.filter(signal => signal.length === 2)[0],
    4: sortedSignals.filter(signal => signal.length === 4)[0],
    7: sortedSignals.filter(signal => signal.length === 3)[0],
    8: sortedSignals.filter(signal => signal.length === 7)[0],
  };

  const nonUniques = sortedSignals.filter(signal => !Object.values(digitMap).includes(signal));

  for (let signal of nonUniques) {
    for (let [potentialDigit, ruleSet] of Object.entries(rules)) {
      if (signal.length !== ruleSet.length) continue;

      let digitPossible = true;
      for (let { digit: targetDigit, overlap: targetOverlap } of ruleSet.overlap) {
        let overlapCount = 0;
        for (let signalByte of digitMap[targetDigit].split('')) {
          if (signal.includes(signalByte)) overlapCount++;
        }
        if (overlapCount !== targetOverlap) {
          digitPossible = false;
          break;
        }
      }
      if (!digitPossible) continue;
      // can only get here if all rules passed
      digitMap[potentialDigit] = signal;
    }
  }

  const outputs = row[1];
  
  const sortedOutputs = outputs.map(entry =>
    entry
      .split('')
      .sort((letter1, letter2) => {
        if (letter1 === letter2) return 0;
        return letter1 < letter2 ? -1 : 1;
      })
      .join('')
  );

  const outputDigits = [];
  for (let output of sortedOutputs) {
    for (let [digit, pattern] of Object.entries(digitMap)) {
      if (output === pattern) {
        outputDigits.push(digit);
        continue;
      }
    }
  }

  const thisVal = parseInt(outputDigits.join(''));
  totalVal += thisVal;
}
console.log(totalVal);
