
export default class Cell {
  constructor(row, col, val) {
    this.row = row;
    this.col = col;
    this.val = parseInt(val);
    this.active = false;
  }

  checkVal(val) {
    if (this.active) return;
    this.active = val == this.val;
  }

  isActive() {
    return this.active;
  }

  calculateWinValue() {
    return !this.active ? this.val : 0;
  }
}