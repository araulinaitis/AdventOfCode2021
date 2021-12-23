import * as fs from 'fs/promises';
import SnailNumber from './SnailNumber.js';

let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('').map(char => !isNaN(parseInt(char)) ? parseInt(char) : char);
console.log(inputData.join(''));

// const number = new SnailNumber(inputData, 0);

// number.reduce();
reduce(inputData);

function reduce(data) {
  let depth = 0;
  let charIdx = 0;
  while (charIdx < data.length) {
    const char = data[charIdx];
    if (char === '[') depth++;
    if (char === ']') depth--;
    if (depth > 4) {
      const nextNumberIdx = findRightNumber(data, charIdx);
      if (nextNumberIdx) {
        ({ data, index: charIdx } = explode(data, nextNumberIdx));
        depth--;
        console.log(data.join(''));
      }
    } else {
      charIdx++;
    }
  }
}

function explode(data, index) {
  const leftNumberIndex = findLeftNumber(data, index - 1);
  if (leftNumberIndex) {
    data[leftNumberIndex] += data[index];
  }

  const rightNumberIndex = findRightNumber(data, index + 3);
  if (rightNumberIndex) {
    data[rightNumberIndex] += data[index + 2];
  }

  // index was the first number, so we need to remove from 1 before this to 3 after this
  data = [...data.slice(0, index - 1), 0, ...data.slice(index + 4)];
  return { data, index };
}

function findLeftNumber(data, index) {
  while (typeof data[index] !== 'number' && index >= -1) index--;
  return index < 0 ? null : index;
}

function findRightNumber(data, index) {
  while (typeof data[index] !== 'number' && index <= data.length - 1) index++;
  return index === data.length ? null : index;
}
