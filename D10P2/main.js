import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n');
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n');
// console.log(inputData);

const chunkDelims = [
  { opening: '[', closing: ']' },
  { opening: '(', closing: ')' },
  { opening: '{', closing: '}' },
  { opening: '<', closing: '>' },
];

const pointMapping = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

let scores = [];
for (let row of inputData) {
  let changed = true;
  // remove closed pairs that are touching
  while (changed === true) {
    let oldRow = JSON.parse(JSON.stringify(row));
    for (let delimSet of chunkDelims) {
      row = row.replace(`${delimSet.opening}${delimSet.closing}`, '');
    }
    changed = oldRow !== row;
  }

  let rowIsCorrupted = false;

  // find any pairs that are open-close touching but not matching
  for (let idx = 0; idx < row.length - 1; ++idx) {
    const thisChar = row[idx];
    const nextChar = row[idx + 1];

    if (!isOpening(thisChar) || !isClosing(nextChar)) continue;

    const expectedChunkDelims = chunkDelims.filter(delim => delim.opening === thisChar);
    if (expectedChunkDelims !== nextChar) {
      rowIsCorrupted = true;
      break;
    }
  }

  if (!rowIsCorrupted) {
    let score = 0;

    for (let idx = row.length - 1; idx >=0; --idx) {
      const thisChar = row[idx];
      const chunkCloser = chunkDelims.filter(delim => delim.opening === thisChar)[0].closing;
      score = score * 5 + pointMapping[chunkCloser];
    }
    scores.push(score);
  }
}

scores = scores.sort((a, b) => {
  if (a === b) return 0;
  return a < b ? -1 : 1;
})

console.log(scores[Math.ceil(scores.length / 2) - 1]);

function isOpening(char) {
  return ['[', '(', '{', '<'].includes(char);
}

function isClosing(char) {
  return [']', ')', '}', '>'].includes(char);
}