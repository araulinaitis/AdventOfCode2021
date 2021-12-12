export default class Cave {
  constructor(name) {
    this.name = name;
    // start and end will be small caves
    this.type = name.toLowerCase() === name ? 'small' : 'big';
    this.linkedCaves = [];
  }

  addLink(cave) {
    this.linkedCaves.push(cave);
  }

  expandPath(path) {
    // shortcut if this is the end cave
    if (this.name === 'end') {
      path.push(this);
      return [path];
    }

    // make sure we never go to start twice
    // since we started at start, we don't have to check if it's in the path
    if (this.name === 'start' && path.length > 1) {
      return null;
    }

    if (this.type === 'small' && countSmallCaves(path) > 1 && countOf(path, this) > 0) {
      return null;
    }

    path.push(this);

    // continue on to connected caves
    let newPaths = [];
    for (let linkedCave of this.linkedCaves) {
      // [...path] makes a new array with the same entries, so we don't copy a reference to the original array
      const newSubPaths = linkedCave.expandPath([...path]);
      if (newSubPaths) newPaths.push(...newSubPaths);
    }

    return newPaths;
  }
}

function countSmallCaves(path) {
  let counts = {};
  for (let cave of path) {
    if (cave.type === 'small') {
      if (!counts[cave.name]) {
        counts[cave.name] = 1;
      } else {
        counts[cave.name]++;
      }
    }
  }

  if (Object.keys(counts).length === 0) {return 0;}
  return Math.max(...Object.values(counts));
}

function countOf(path, caveToCount) {
  if (caveToCount.name === 'start' || caveToCount.name === 'end') return 2;
  return path.filter(cave => cave == caveToCount).length;
}
