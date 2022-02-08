import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(entry => parseInt(entry.match(/Player [0-9]+ starting position: ([0-9]+)/)[1]));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(entry => parseInt(entry.match(/Player [0-9]+ starting position: ([0-9]+)/)[1]));

// console.log(inputData);

let rollNum = 0;
let diceVal = 1;
let scores = [0, 0];
while (scores.every(val => val < 1000)) {
  for (let player = 0; player < 2; ++player) {
    for (let roll = 0; roll < 3; ++roll) {
      // console.log(`${inputData[player]} + ${diceVal} => ${((inputData[player] + diceVal - 1) % 10 + 1)}`);
      inputData[player] = ((inputData[player] + diceVal - 1) % 10) + 1;
      diceVal++;
      rollNum++;
    }
    scores[player] += inputData[player];
    if (scores[0] >= 1000) break;
  }
  console.log(scores);
}
console.log(rollNum);
console.log(scores);
console.log(Math.min(...scores) * rollNum);
