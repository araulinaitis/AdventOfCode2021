export default class Cell {
  constructor(inputData = [[0]], row = 0, col = 0) {
    this.row = row;
    this.col = col;
    this.risk = inputData[row][col];
    this.adjacentCells = [];
    this.bestPath = null;
    this.trueBestPath = false;
  }
  
  expandGrid(rowOffset, colOffset, numRows, numCols) {
    // start with blank cell;
    const newCell = new Cell();
    // change the indices and risks
    newCell.row = this.row + numRows * rowOffset;
    newCell.col = this.col + numCols * colOffset;
    newCell.risk = incrementRisk(this.risk, rowOffset + colOffset);
    return newCell;
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

  verifyBestPath() { 
    // if adding this cell to any adjacent makes it worse than the current path, this is the best current path
    let isBestPath = true;
    for (let neighbor of this.adjacentCells) {
      if (neighbor.bestPath.risk + this.risk < this.bestPath.risk) {
        isBestPath = false;
        this.bestPath = { cells: [this, ...neighbor.bestPath.cells], risk: this.risk + neighbor.bestPath.risk };
      }
    }

    this.trueBestPath = isBestPath;
    return isBestPath;
  }

  addToPath(path) {
    let newPath = { cells: [this, ...path.cells], risk: path.risk + this.risk };
    return newPath;
  }
}

function incrementRisk(risk, inc) {
  for (let i = 1; i <= inc; ++i) {
    risk = (risk + 1) % 10 || 1;
  }
  return risk;
}
