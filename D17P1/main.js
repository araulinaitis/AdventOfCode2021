import * as fs from 'fs/promises';


let inputData = Object.fromEntries(
  (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' }))
    .split('target area: ')[1]
    .split(', ')
    .map(axis => axis.split('='))
);

// let inputData = Object.fromEntries(
//   (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' }))
//     .split('target area: ')[1]
//     .split(', ')
//     .map(axis => axis.split('='))
// );
// console.log(inputData);

for (let [key, val] of Object.entries(inputData)) {
  const splitVals = val.split('..');
  inputData[key] = {};
  inputData[key].min = parseInt(splitVals[0]);
  inputData[key].max = parseInt(splitVals[1]);
}
console.log(inputData);

const minXSpeed = 1;
const maxXSpeed = inputData.x.max + 1; // if we go this fast we'll be beyond the end of the zone after one tick
const minYSpeed = inputData.y.min + 1;
const maxYSpeed = 1000;

const goodSpeeds = [];
let maxYs = [];

for (let xSpeed = maxXSpeed; xSpeed >= minXSpeed; --xSpeed) {
  for (let ySpeed = minYSpeed; ySpeed <= maxYSpeed; ++ySpeed) {
    let state = { x: 0, y: 0, xSpeed, ySpeed };
    let thisBestY = -Infinity;
    while (!isPassedTarget(state)) {
      step(state);
      if (state.y > thisBestY) {
        thisBestY = state.y;
      }
    }

    if (isInTarget(state)) {
    goodSpeeds.push({ xSpeed, ySpeed });
    maxYs.push(thisBestY);
    }
  }
}

console.log({goodSpeeds, maxYs});
console.log(Math.max(...maxYs));

function step(state) {
  state.x += state.xSpeed;
  state.y += state.ySpeed;
  if (state.xSpeed > 0 ) {
    state.xSpeed -= 1;
  }
  else if (state.xSpeed < 0) {
    state.xSpeed += 1;
  }
  // state.xSpeed = (Math.abs(state.x) - 1) * Math.sign(state.x);
  state.ySpeed -= 1;
}

function isPassedTarget(state) {
  return state.x >= inputData.x.max || state.y <= inputData.y.min;
}

function isInTarget(state) {
  return state.x >= inputData.x.min && state.x <= inputData.x.max && state.y >= inputData.y.min && state.y <= inputData.y.max;
}