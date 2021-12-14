import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');

const dotCoords = inputData.filter(data => !data.includes('fold')).map(data => data.split(',').map(val => parseInt(val)));

const foldInstructions = inputData
  .filter(data => data.includes('fold'))
  .map(data => data.split('fold along '))
  .map(data => data.filter(data => data !== ''))
  .map(data => data[0])
  .map(data => data.split('='))
  .map(([key, val]) => {
    let out = {};
    out.axis = key;
    out.val = parseInt(val);
    return out;
  });

const xMin = Math.min(...dotCoords.map(coord => coord[0]));
const xMax = Math.max(...dotCoords.map(coord => coord[0]));
const yMin = Math.min(...dotCoords.map(coord => coord[1]));
const yMax = Math.max(...dotCoords.map(coord => coord[1]));

let page = [];
// because x is columns and y is rows, it's backwards (like this sentence)
for (let y = yMin; y <= yMax; ++y) {
  page.push(Array(xMax - xMin + 1).fill(false));
}

for (let coord of dotCoords) {
  page[coord[1]][coord[0]] = true;
}

const foldFuncs = {
  x: foldX,
  y: foldY,
};

for (let fold of foldInstructions) {
  page = foldFuncs[fold.axis](page, fold.val);
  break;
}

console.log({dotCount: page.map(row => row.reduce((prev, cur) => prev + (cur ? 1 : 0), 0)).reduce((prev, cur) => prev + cur)});

function foldX(page, foldVal) {
  // fold right onto left
  const leftPage = page.map(row => row.filter((val, valIdx) => valIdx < foldVal));
  const rightPage = page.map(row => row.filter((val, valIdx) => valIdx > foldVal));

  // folding right to left, rows map to rows
  for (let [rowIdx, row] of rightPage.entries()) {
    for (let [colIdx, val] of row.entries()) {
      const reflectedIdx = reflect(foldVal, colIdx + foldVal + 1);
      leftPage[rowIdx][reflectedIdx] = leftPage[rowIdx][reflectedIdx] || val;
    }
  }

  return leftPage;
}

function foldY(page, foldVal) {
  // fold bottom onto top
  const topPage = page.filter((row, rowIdx) => rowIdx < foldVal);
  const bottomPage = page.filter((row, rowIdx) => rowIdx > foldVal);

  // folding bottom to top, columns map to columns;

  for (let [rowIdx, row] of bottomPage.entries()) {
    for (let [colIdx, val] of row.entries()) {
      const reflectedIdx = reflect(foldVal, rowIdx + foldVal + 1);
      topPage[reflectedIdx][colIdx] = topPage[reflectedIdx][colIdx] || val;
    }
  }

  return topPage;
}

function reflect(axis, val) {
  return axis - (val - axis);
}
