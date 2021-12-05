import * as fs from 'fs/promises';
import Line from './Line.js';

const inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' }))
  .split('\r\n')
  .map(subEntry => subEntry.split(' -> '))
  .map(subEntry => subEntry.map(subSubEntry => subSubEntry.split(',')));

// const inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' }))
//   .split('\r\n')
//   .map(subEntry => subEntry.split(' -> '))
//   .map(subEntry => subEntry.map(subSubEntry => subSubEntry.split(',')));

let lineArr = [];
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;

for (let lineInfo of inputData) {
  const newLine= new Line(lineInfo[0], lineInfo[1])
  minX = Math.min(minX, newLine.minX);
  maxX = Math.max(maxX, newLine.maxX);
  minY = Math.min(minY, newLine.minY);
  maxY = Math.max(maxY, newLine.maxY);
  lineArr.push(newLine);
}

const width = maxX - minX + 1; // +1 because pixels are inclusive;
const height = maxY - minY + 1;

const xOffset = -1 * minX;
const yOffset = -1 * minY;

const grid = Array(width).fill([]).map(() => Array(height).fill(0));

for (let line of lineArr) {
  for (let coveredPixel of line.coveredPixels) {
    grid[coveredPixel.y + yOffset][coveredPixel.x + xOffset]++; // swap order because x and y vs row/col
  }
}

const countCellsOverOne = grid.map(row => row.filter(val => val > 1)).map(row => row.length).reduce((prevVal, curVal) => prevVal + curVal);
console.log(countCellsOverOne);