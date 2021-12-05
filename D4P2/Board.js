import Cell from "./Cell.js";

export default class Board {
  constructor(gridArr) {
    this.cells = []
    for (let [rowIdx, row] of gridArr.entries()) {

      row = row.split(' ').filter(val => val !== '');
      let cellRow = [];
      for (let [colIdx, val] of row.entries()) {
        cellRow.push(new Cell(rowIdx, colIdx, val));
      }
      this.cells.push(cellRow);
    }

    this.rowCount = this.cells.length;
    this.colCount = this.cells[0].length;
    this.hasAlreadyWon = false;
  }

  step(val) {
    if (this.hasAlreadyWon) return false;
    for (let cellRow of this.cells) {
      for (let cell of cellRow) {
        cell.checkVal(val);
      }
    }
  }

  checkWin() {
    if (this.hasAlreadyWon) return false;
    // winning criteria: rows and cols

    // check rows
    for (let rowIdx = 0; rowIdx < this.rowCount; ++rowIdx) {
      let isRowWin = true;
      for (let cell of this.cells[rowIdx]) {
        if (!cell.isActive()) {
          isRowWin = false;
          break;
        }
      }
      if (isRowWin) {
        this.hasAlreadyWon = true;
        return true;
      }
    }

    // check cols
    let colIdx = 0;
    while (colIdx < this.colCount) {
      let isColWin = true;
      // check this col of each row
      for (let row of this.cells) {
        if (!row[colIdx].isActive()) {
          isColWin = false;
          break;
        }
      }
      if (isColWin) {
        this.hasAlreadyWon = true;
        return true;
      }
      colIdx++;
    }

    return false;
  }

  calculateInactiveValue() {
    let val = 0;
    for (let row of this.cells) {
      for (let cell of row) {
        val += cell.calculateWinValue();
      }
    }
    return val;
  }
}