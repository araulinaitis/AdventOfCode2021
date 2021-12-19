
  // expandPath(path, endCell) {
  //   // take one path, return up to 3 paths
  //   if (path.hasEnded) return [path];

  //   let newPaths = [];
  //   for (let neighbor of this.adjacentCells) {
  //     if (path.cells.includes(neighbor)) continue;
  //     // if a path winds around to a place that's 1 step away from a cell already in this path, we know
  //     // it was covered by a different path
  //     let isRedundant = false;
  //     for (let idx = path.cells.length - 2; idx >= 0; --idx) {
  //       if (path.cells[idx].adjacentCells.includes(neighbor)) {
  //         isRedundant = true;
  //         break;
  //       }
  //     }
  //     if (isRedundant) continue;
  //     let newPath = neighbor.addToPath(path, endCell);
  //     if (newPath.cells[newPath.cells.length - 1].isEnd) newPath.hasEnded = true;

  //     newPaths.push(newPath);
  //   }
  //   if (newPaths.length === 0) {
  //     return [];
  //   }
  //   return newPaths;
  // }

  // addToPath(path, endCell) {
  //   let newPath = { cells: [...path.cells, this], risk: path.risk + this.risk };

  //   // calculate worst minimum path, and best minimum path
  //   // worst minimum path would be the worst possible score you could get by going straight form here to end (9s all the way)
  //   // best minimum path is the best if you went straight to the end (all 1s)
  //   // when culling paths later, if one path's best minimum path is worse than another's worst minimum path, it's not worth continuing to explore

  //   const dX = Math.abs(endCell.col - this.col);
  //   const dY = Math.abs(endCell.row - this.row);

  //   newPath.bestMinPath = newPath.risk + dX + dY;
  //   newPath.worstMinPath = newPath.risk + 9 * (dX + dY);
  //   return newPath;
  // }