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

    let newPaths = [];
    // don't visit small cave twice
    // this will also catch ends because ends are small
    if (this.type === 'small' && path.includes(this)) {
      return [path];
    }

    path.push(this);

    // continue on to connected caves
    for (let linkedCave of this.linkedCaves) {
      // [...path] makes a new array with the same entries, so we don't copy a reference to the original array
      const newSubPaths = linkedCave.expandPath([...path]);
      newPaths.push(...newSubPaths);
    }

    return newPaths;
  }
}
