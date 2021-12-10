import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => parseInt(val)));
// console.log(inputData);

let minima = [];
for (let [rowIdx, row] of inputData.entries()) {
  for (let [colIdx, val] of row.entries()) {
    if (isLocalMin(rowIdx, colIdx)) {
      minima.push({ rowIdx, colIdx, val });
    }
  }
}

let basins = [];

for (let minimum of minima) {
  let thisBasin = [minimum];
  thisBasin = expandBasin(thisBasin, minimum);
  basins.push(thisBasin);
}

basins = basins.sort((basin1, basin2) => {
  if (basin1.length === basin2.length) return 0;
  return basin1.length > basin2.length ? -1 : 1;
});

console.log(basins[0].length * basins[1].length * basins[2].length);

function expandBasin(basinArr, thisCell) {
  const upCell = { rowIdx: thisCell.rowIdx - 1, colIdx: thisCell.colIdx, val: inputData?.[thisCell.rowIdx - 1]?.[thisCell.colIdx] };
  if (thisCell.rowIdx > 0 && upCell.val > thisCell.val && upCell.val !== 9) {
    if (!cellIsIn(basinArr, upCell)) {
      basinArr.push(upCell);
      basinArr = expandBasin(basinArr, upCell);
    }
  }

  const downCell = { rowIdx: thisCell.rowIdx + 1, colIdx: thisCell.colIdx, val: inputData?.[thisCell.rowIdx + 1]?.[thisCell.colIdx] };
  if (thisCell.rowIdx < inputData.length - 1 && downCell.val > thisCell.val && downCell.val !== 9) {
    if (!cellIsIn(basinArr, downCell)) {
      basinArr.push(downCell);
      basinArr = expandBasin(basinArr, downCell);
    }
  }

  const leftCell = { rowIdx: thisCell.rowIdx, colIdx: thisCell.colIdx - 1, val: inputData?.[thisCell.rowIdx]?.[thisCell.colIdx - 1] };
  if (thisCell.colIdx > 0 && leftCell.val > thisCell.val && leftCell.val !== 9) {
    if (!cellIsIn(basinArr, leftCell)) {
      basinArr.push(leftCell);
      basinArr = expandBasin(basinArr, leftCell);
    }
  }

  const rightCell = { rowIdx: thisCell.rowIdx, colIdx: thisCell.colIdx + 1, val: inputData?.[thisCell.rowIdx]?.[thisCell.colIdx + 1] };
  if (thisCell.rowIdx < inputData[0].length - 1 && rightCell.val > thisCell.val && rightCell.val !== 9) {
    if (!cellIsIn(basinArr, rightCell)) {
      basinArr.push(rightCell);
      basinArr = expandBasin(basinArr, rightCell);
    }
  }

  return basinArr;
}

function cellIsIn(array, cell) {
  for (let entry of array) {
    if (entry.rowIdx == cell.rowIdx && entry.colIdx == cell.colIdx) {
      return true;
    }
  }
  return false;
}

function isLocalMin(rowIdx, colIdx) {
  const thisVal = inputData[rowIdx][colIdx];
  if (rowIdx > 0) {
    // check cell above
    if (inputData[rowIdx - 1][colIdx] <= thisVal) return false;
  }

  if (rowIdx < inputData.length - 1) {
    // check cell below
    if (inputData[rowIdx + 1][colIdx] <= thisVal) return false;
  }

  if (colIdx > 0) {
    // check cell left
    if (inputData[rowIdx][colIdx - 1] <= thisVal) return false;
  }

  if (colIdx < inputData[0].length - 1) {
    // check cell right
    if (inputData[rowIdx][colIdx + 1] <= thisVal) return false;
  }

  return true;
}
