export default class Cell {
  constructor(inputData = [[0]], row = 0, col = 0) {
    this.row = row;
    this.col = col;
    this.risk = inputData[row][col];
    this.adjacentCells = [];
    this.bestPath = null;
  }

  expandGrid(rowOffset, colOffset, numRows, numCols) {
    // start with blank cell;
    const newCell = new Cell();
    // change the indices and risks
    newCell.row = this.row + numRows * rowOffset;
    newCell.col = this.col + numCols * colOffset;
    // newCell.risk = (this.risk + rowOffset + colOffset) % 10 || 1;
    newCell.risk = incrementRisk(this.risk, rowOffset + colOffset);
    // console.log({rowOffset, colOffset, oldRisk: this.risk, newRisk: newCell.risk})
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
    if (this.isEnd) {
      this.bestPath = { cells: [this], risk: this.risk };
      return;
    }

    for (let neighbor of this.adjacentCells) {
      if (neighbor.isEnd) {
        const endPath = { cells: [this, neighbor], risk: this.risk + neighbor.risk };
        this.bestPath = endPath;
      } else if (neighbor.bestPath) {
        // if (neighbor.bestPath.cells.includes(this)) continue;
        // add this to start of that path and update risk
        // const thisPath = this.addToPath(neighbor.bestPath);
        const thisPath = { cells: [this, ...neighbor.bestPath.cells], risk: this.risk + neighbor.bestPath.risk };

        if (thisPath.risk < (this?.bestPath?.risk ?? Infinity)) {
          this.bestPath = thisPath;
        }
      }
    }

    // only look for other paths if we've found a path above
    // this avoids runaway call stacks
    if (this.bestPath) {
      let path = { cells: [this], risk: this.risk };
      let newBestPath = this.expandPath(path, this.bestRisk);

      if (newBestPath) {
        if (newBestPath.risk < (this?.bestPath?.risk ?? Infinity)) {
          this.bestPath = newBestPath;
        }
      }
      // now build paths through neighboring cells until you find a cell w/ bestPath
      // don't need to check for end because cells adjacent to end will have a bestPath
      // for (let neighbor of this.adjacentCells) {
      //   if (!neighbor.bestPath) {
      //     let thisPaths = neighbor.expandPath(path, bestRisk);
      //     for (let thisPath of thisPaths) {
      //       if (thisPath.risk <= bestRisk) {
      //         bestRisk = thisPath.risk;
      //         this.bestPath = thisPath;
      //       }
      //     }
      //   }
      // }
    }
  }

  addToPath(path) {
    let newPath = { cells: [this, ...path.cells], risk: path.risk + this.risk };
    return newPath;
  }

  expandPath(path, maxRisk) {
    // if this cell is already in the path, it can't be better than branching from that earlier point where this cell was visited
    if (path.cells.includes(this)) return null;
    let newBestPath = null;

    path = { cells: [...path.cells, this], risk: path.risk + this.risk };
    // if adding this cell to the existing path is worse than the current best, there's no reason to branch
    if (path.risk > maxRisk) return null;

    for (let neighbor of this.adjacentCells) {
      if (neighbor.bestPath) {
        const newPath = { cells: [...path.cells, ...neighbor.bestPath.cells], risk: neighbor.bestPath.risk + path.risk };
        if (newPath.risk < maxRisk) {
          (maxRisk = newPath.risk), (newBestPath = newPath);
        }
      } else {
        const newPath = neighbor.expandPath(path, maxRisk);
        if (newPath.risk < maxRisk) {
          maxRisk = newPath.risk;
          newBestPath = newPath;
        }
      }
    }
    return newBestPath;
  }
}

function incrementRisk(risk, inc) {
  for (let i = 1; i <= inc; ++i) {
    risk = (risk + 1) % 10 || 1;
  }
  return risk;
}
