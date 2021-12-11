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
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

let score = 0;
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

  // find any pairs that are open-close touching but not matching
  for (let idx = 0; idx < row.length - 1; ++idx) {
    const thisChar = row[idx];
    const nextChar = row[idx + 1];

    if (!isOpening(thisChar) || !isClosing(nextChar)) continue;

    const expectedChunkDelims = chunkDelims.filter(delim => delim.opening === thisChar);
    if (expectedChunkDelims !== nextChar) {
      score += pointMapping[nextChar];
      break;
    }
  }
}

console.log(score);

function isOpening(char) {
  return ['[', '(', '{', '<'].includes(char);
}

function isClosing(char) {
  return [']', ')', '}', '>'].includes(char);
}