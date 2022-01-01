import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').filter(entry => entry !== '');

const algorithm = inputData[0];
let image = inputData.slice(1).map(row => row.split(''));

// console.log(inputData);
const numBorders = 100;
const numIter = 50;

for (let iter = 0; iter < numIter; ++iter) {
  for (let borderNum = 0; borderNum < numBorders; ++borderNum) {
    image = addBorder(image);
  }
  let newImage = [];
  for (let [rowIdx, row] of image.entries()) {
    const lastRowIdx = rowIdx - 1;
    const nextRowIdx = rowIdx + 1;
    let newRow = [];
    for (let [colIdx, val] of row.entries()) {
      const lastColIdx = colIdx - 1;
      const nextColIdx = colIdx + 1;
      const algorithmIndex = binStrToIndex([
        image?.[lastRowIdx]?.[lastColIdx] ?? '.',
        image?.[lastRowIdx]?.[colIdx] ?? '.',
        image?.[lastRowIdx]?.[nextColIdx] ?? '.',
        image?.[rowIdx]?.[lastColIdx] ?? '.',
        val,
        image?.[rowIdx]?.[nextColIdx] ?? '.',
        image?.[nextRowIdx]?.[lastColIdx] ?? '.',
        image?.[nextRowIdx]?.[colIdx] ?? '.',
        image?.[nextRowIdx]?.[nextColIdx] ?? '.',
      ]);
      newRow.push(algorithm[algorithmIndex]);
    }
    newImage.push(newRow);
  }
  image = newImage;
  console.log(iter);
  // console.log(image.map(row => row.join('')));
  // console.log('-----');
  // image.map(row => console.log(row.join('')));
  // console.log('-----');
}

let litCount = 0;
for (let rowIdx = numBorders * numIter - numIter; rowIdx < image.length - (numBorders * numIter - numIter); ++rowIdx) {
  for (let colIdx = numBorders * numIter - numIter; colIdx < image[rowIdx].length - (numBorders * numIter - numIter); ++colIdx) {
    litCount += image[rowIdx][colIdx] === '#' ? 1 : 0;
  }
}
console.log(litCount);
// console.log(image.map(row => row.map(val => val === '#' ? 1 : 0)).map(row => row.reduce((prev, cur) => prev + cur)).reduce((prev, cur) => prev + cur));

function binStrToIndex(binStr) {
  let num = 0;
  let pow = 0;
  for (let idx = binStr.length - 1; idx >= 0; --idx) {
    num += binStr[idx] === '#' ? Math.pow(2, pow) : 0;
    pow++;
  }
  return num;
}

function addBorder(image) {
  let newImage = [];
  const topBorder = new Array(image[0].length + 2).fill('.');
  const bottomBorder = new Array(image[0].length + 2).fill('.');
  newImage.push(topBorder);
  for (let row of image) {
    newImage.push(['.', ...row, '.']);
  }
  newImage.push(bottomBorder);

  return newImage;
}