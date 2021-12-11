export default class Octopus {
  constructor(rowIdx, colIdx, val) {
    this.rowIdx = rowIdx;
    this.colIdx = colIdx;
    this.val = val;
    this.neighbors = [];
    this.didFlash = false;
  }

  addNeighbors(octoGrid) {
    // cardinal directions
    if (this.rowIdx > 0) this.neighbors.push(octoGrid[this.rowIdx - 1][this.colIdx]);
    if (this.rowIdx < octoGrid.length - 1) this.neighbors.push(octoGrid[this.rowIdx + 1][this.colIdx]);
    if (this.colIdx > 0) this.neighbors.push(octoGrid[this.rowIdx][this.colIdx - 1]);
    if (this.colIdx < octoGrid[0].length - 1) this.neighbors.push(octoGrid[this.rowIdx][this.colIdx + 1]);

    // diagonals

    // up/left
    if (this.rowIdx > 0 && this.colIdx > 0) this.neighbors.push(octoGrid[this.rowIdx - 1][this.colIdx - 1]);
    // up/right
    if (this.rowIdx > 0 && this.colIdx < octoGrid[0].length - 1) this.neighbors.push(octoGrid[this.rowIdx - 1][this.colIdx + 1]);
    // down/left
    if (this.rowIdx < octoGrid.length - 1 && this.colIdx > 0) this.neighbors.push(octoGrid[this.rowIdx + 1][this.colIdx - 1]);
    // down/right
    if (this.rowIdx < octoGrid.length - 1 && this.colIdx < octoGrid[0].length - 1) this.neighbors.push(octoGrid[this.rowIdx + 1][this.colIdx + 1]);
  }

  step() {
    if (!this.didFlash) {
      this.val++;
    }
    if (this.val > 9 && !this.didFlash) {
      this.didFlash = true;
      this.val = 0;
      for (let neighbor of this.neighbors) {
        neighbor.step();
      }
    }
  }
}
