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

const minX = Math.min(...steps.map(step => step.coords.x.min));
const minY = Math.min(...steps.map(step => step.coords.y.min));
const minZ = Math.min(...steps.map(step => step.coords.z.min));
const maxX = Math.max(...steps.map(step => step.coords.x.max));
const maxY = Math.max(...steps.map(step => step.coords.y.max));
const maxZ = Math.max(...steps.map(step => step.coords.z.max));
console.log({minX, minY, minZ, maxX, maxY, maxZ});

// let litCount = 0;
// let cells = {};
// // go backwards so we can lock in each voxel the first time it's hit
// for (let step of steps.reverse()) {
//   const thisState = step.state;
//   for (let x = step.coords.x.min; x <= step.coords.x.max; x = parseInt(x + 1)) {
//     if (!cells[x]) cells[x] = {};
//     for (let y = step.coords.y.min; y <= step.coords.y.max; y = parseInt(y + 1)) {
//       if (!cells[x][y]) cells[x][y] = {};
//       for (let z = step.coords.z.min; z <= step.coords.z.max; z = parseInt(z + 1)) {
//         if (!cells[x][y][z]) {
//           cells[x][y][z] = true;
//           litCount += thisState ? 1 : 0;
//         }
//       }
//     }
//     console.log(x);
//   }
//   console.log(step);
// }

steps.reverse();
// let litCount = 0;
// for (let x = minX; x <= maxX; x = parseInt(x + 1)) {
//   for (let y = minY; y <= maxY; y = parseInt(y + 1)) {
//     for (let z = minZ; z <= maxZ; z = parseInt(z + 1)) {
//       for (let step of steps) {
//         // if (x >= step.coords.x.min && x <= step.coords.x.max && y >= step.coords.y.min && y <= step.coords.y.max && z >= step.coords.z.min && z <= step.coords.z.max) {
//         //   litCount += step.state ? 1 : 0;
//         //   break;
//         // }
//         litCount +=
//           step.state && x >= step.coords.x.min && x <= step.coords.x.max && y >= step.coords.y.min && y <= step.coords.y.max && z >= step.coords.z.min && z <= step.coords.z.max
//             ? 1
//             : 0;
//       }
//     }
//   }
//   console.log(x);
// }
// console.log(litCount);

let cells = {};
let stepCount = 0;
for (let step of steps) {
  for (let x = step.coords.x.min; x <= step.coords.x.max; x = parseInt(x + 1)) {
    if (!cells[x] && step.state) cells[x] = {};
    for (let y = step.coords.y.min; y <= step.coords.y.max; y = parseInt(y + 1)) {
      if (!cells[x][y] && step.state) cells[x][y] = {};
      for (let z = step.coords.z.min; z <= step.coords.z.max; z = parseInt(z + 1)) {
        if (step.state) cells[x][y][z] = step.state;
      }
    }
  }
  stepCount++;
  console.log(stepCount);
}

// let cells = {};
// let stepCount = 0;
// for (let step of steps) {
//   for (let x = step.coords.x.min; x <= step.coords.x.max; x = parseInt(x + 1)) {
//     if (!cells[x] && step.state) cells[x] = {};
//     for (let y = step.coords.y.min; y <= step.coords.y.max; y = parseInt(y + 1)) {
//       if (!cells[x][y] && step.state) cells[x][y] = {};
//       for (let z = step.coords.z.min; z <= step.coords.z.max; z = parseInt(z + 1)) {
//         if (step.state) cells[x][y][z] = step.state;
//       }
//     }
//   }
//   stepCount++;
//   console.log(stepCount);
// }

// let litCount = 0;
// for (let x of Object.keys(cells)) {
//   for (let y of Object.keys(cells[x])) {
//     for (let z of Object.keys(cells[x][y])) {
//       litCount += cells[x][y][z] ? 1 : 0;
//     }
//   }
// }

console.log(litCount);
