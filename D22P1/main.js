import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

console.log(inputData);
let steps = [];
for (let row of inputData) {
  let newStep = {};
  newStep.state = row[0] === 'on';
  let coords = row[1].split(',').map(coord => coord.split('..').map(entry => parseInt(entry.replace(/[a-z]=/, ''))));
  newStep.coords = {
    x: { min: Math.min(...coords[0]), max: Math.max(...coords[0]) },
    y: { min: Math.min(...coords[1]), max: Math.max(...coords[1]) },
    z: { min: Math.min(...coords[2]), max: Math.max(...coords[2]) },
  };
  steps.push(newStep);
}
console.log(steps[10]);

let cells = {};
for (let x = -50; x <= 50; x = parseInt(x + 1)) {
  if (!cells[x]) cells[x] = {};
  for (let y = -50; y <= 50; y = parseInt(y + 1)) {
    if (!cells[x][y]) cells[x][y] = {};
    for (let z = -50; z <= 50; z = parseInt(z + 1)) {
      cells[x][y][z] = false;
    }
  }
}

for (let step of steps) {
  for (let x = step.coords.x.min; x <= step.coords.x.max; x = parseInt(x + 1)) {
    if (!cells[x]) continue;
    for (let y = step.coords.y.min; y <= step.coords.y.max; y = parseInt(y + 1)) {
      if (!cells[x][y]) continue;
      for (let z = step.coords.z.min; z <= step.coords.z.max; z = parseInt(z + 1)) {
        if (cells[x][y][z] === undefined) continue;
        cells[x][y][z] = step.state;
      }
    }
  }
}

let litCount = 0;
for (let x = -50; x <= 50; ++x) {
  for (let y = -50; y <= 50; ++y) {
    for (let z = -50; z <= 50; ++z) {
      litCount += cells[x][y][z] ? 1 : 0;
    }
  }
}

console.log(litCount);
