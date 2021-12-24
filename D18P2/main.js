import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' }))
  .split('\r\n')
  .map(row=> row.split('').map(char => (!isNaN(parseInt(char)) ? parseInt(char) : char)));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' }))
//   .split('\r\n')
//   .map(row=> row.split('').map(char => (!isNaN(parseInt(char)) ? parseInt(char) : char)));
// console.log(inputData);

let bestMagnitude = -Infinity;
for (let firstRowIdx = 0; firstRowIdx < inputData.length; ++firstRowIdx) {
  for (let secondRowIdx = 0; secondRowIdx < inputData.length; ++secondRowIdx) {
    if (firstRowIdx === secondRowIdx) continue;
    let sum = addNumbers(inputData[firstRowIdx], inputData[secondRowIdx]);

    let didChange = true;
    while (didChange) {
      ({ data: sum, didChange } = reduce(sum));
    }
    console.log({sum: sum.join('')});

    const magnitude = finalSum(sum);
    console.log({magnitude});
    if (magnitude > bestMagnitude) bestMagnitude = magnitude;
  }
}

console.log(bestMagnitude);
// let sum = inputData[0];
// console.log(sum.join(''));
// let nextIdx = 1;
// while (nextIdx < inputData.length) {
//   console.log(`Adding ${sum.join('')} and ${inputData[nextIdx].join('')}`);
//   sum = addNumbers(sum, inputData[nextIdx]);
//   console.log({currentSum: sum.join('')});
//   let didChange = true;
//   while (didChange) {
//     ({ data: sum, didChange } = reduce(sum));
//   }
//   nextIdx++;
//   console.log(`reduced sum: ${sum.join('')}`);
// }

// finalSum(sum);

function finalSum(data) {
  let numberPairs = ['dummy'];
  while (numberPairs.length) {
    numberPairs = [...data.join('').matchAll(/\[([0-9]+),([0-9]+)\]/g)];

    for (let [origStr, digit1, digit2] of numberPairs) {
      data = data
        .join('')
        .replace(origStr, (3 * digit1 + 2 * digit2).toString())
        .split('');
    }
    console.log(data.join(''));
  }
  return parseInt(data.join(''));
}

// const res = parseReducedString(inputData);
// console.log(res);

function addNumbers(num1, num2) {
  return ['[', ...num1, ',', ...num2, ']'];
}

function reduce(data) {
  let depth = 0;
  let charIdx = 0;
  while (charIdx < data.length) {
    const char = data[charIdx];
    if (char === '[') depth++;
    if (char === ']') depth--;
    if (depth > 4) {
      console.log({ char, charIdx });
      let nextNumberIdx = findRightNumber(data, charIdx);
      // while (data[nextNumberIdx + 1] !== ',' && typeof data[nextNumberIdx + 2] !== 'number' && nextNumberIdx < data.length) nextNumberIdx = findRightNumber(data, nextNumberIdx);
      if (nextNumberIdx) {
        data = explode(data, nextNumberIdx);
        depth--;
        console.log(data.join(''));
        return { data, didChange: true };
      }
    } else {
      charIdx++;
    }
  }
  
  charIdx = 0;
  while (charIdx < data.length) {
    const char = data[charIdx];
    if (!isNaN(parseInt(char)) && parseInt(char) >= 10) {
      data = split(data, charIdx);
      console.log(data.join(''));
      return { data, didChange: true };
    } else {
      charIdx++;
    }
  }
  console.log({depth});
  return { data, didChange: false };
}

function explode(data, index) {
  // check if this number is dual-digit
  const thisNum = data[index];
  const rightNumIdx = index + 2;
  const nextNum = data[rightNumIdx];
  console.log(`exploding: [${thisNum}, ${nextNum}]`);
  const leftNumberIndex = findLeftNumber(data, index - 1);
  if (leftNumberIndex) {
    data[leftNumberIndex] += thisNum;
  }

  const rightNumberIndex = findRightNumber(data, rightNumIdx + 1);
  if (rightNumberIndex) {
    data[rightNumberIndex] += nextNum;
  }

  // index was the first number, so we need to remove from 1 before this to 3 after this
  data = [...data.slice(0, index - 1), 0, ...data.slice(rightNumIdx + 2)];
  return data;
}

function split(data, index) {
  const thisNum = data[index];
  const nextIdx = index + 1;
  console.log(`splitting: ${thisNum}`);
  const char = data[index];
  const leftEl = Math.floor(parseInt(char) / 2);
  const rightEl = Math.ceil(parseInt(char) / 2);
  data = [...data.slice(0, index), '[', leftEl, ',', rightEl,']', ...data.slice(nextIdx)].map(char => (!isNaN(parseInt(char)) ? parseInt(char) : char));
  return data;
}

function findLeftNumber(data, index) {
  while (typeof data[index] !== 'number' && index >= -1) index--;
  return index < 0 ? null : index;
}

function findRightNumber(data, index) {
  while (typeof data[index] !== 'number' && index <= data.length - 1) index++;
  return index === data.length ? null : index;
}