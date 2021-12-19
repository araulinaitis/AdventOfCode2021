export default class Cell {
  constructor(inputData, row, col) {
    this.row = row;
    this.col = col;
    if (row === 0 && col === 0) {
      this.risk = 0;
    } else {
      this.risk = inputData[row][col];
    }
    this.adjacentCells = [];
    this.isEnd = row === inputData.length - 1 && col === inputData[0].length - 1;
    this.bestPath = null;
  }

  populateAdjacents(grid) {
    this.adjacentCells.push(grid?.[this.row - 1]?.[this.col]);
    this.adjacentCells.push(grid?.[this.row + 1]?.[this.col]);
    this.adjacentCells.push(grid?.[this.row]?.[this.col - 1]);
    this.adjacentCells.push(grid?.[this.row]?.[this.col + 1]);
    this.adjacentCells = this.adjacentCells.filter(cell => cell);
  }

  findBestPath() {
    let bestRisk = Infinity;

    if (this.isEnd) {
      this.bestPath = {cells: [this], risk: this.risk};
    }

    for (let neighbor of this.adjacentCells) {
      if (neighbor.bestPath) {
        if (neighbor.bestPath.cells.includes(this)) continue;
        // add this to start of that path and update risk
        const thisPath = this.addToPath(neighbor.bestPath);
        if (thisPath.risk > bestRisk) continue;
        if (thisPath.risk < bestRisk) {
          bestRisk = thisPath.risk;
          this.bestPath = thisPath;
        }
      } else if (neighbor.isEnd) {
        const thisPath = { cells: [this, neighbor], risk: this.risk + neighbor.risk };
        if (thisPath.risk > bestRisk) continue;
        if (thisPath.risk < bestRisk) {
          bestRisk = thisPath.risk;
          this.bestPath = thisPath;
        }
      }
    }
  }

  addToPath(path) {
    let newPath = { cells: [this, ...path.cells], risk: path.risk + this.risk };
    return newPath;
  }
}
