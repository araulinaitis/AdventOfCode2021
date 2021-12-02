import * as fs from 'fs/promises';

const funcs = { forward, up, down };

const inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

let runningTotals = { aim: 0, horizontal: 0, vertical: 0 };
for (let row of inputData) {
  funcs[row[0]](parseInt(row[1]));
}
console.log(runningTotals, runningTotals.horizontal * runningTotals.vertical);

function forward(val) {
  runningTotals.horizontal += val;
  runningTotals.vertical += val * runningTotals.aim;
}

function up(val) {
  runningTotals.aim -= val;
}

function down(val) {
  runningTotals.aim += val;
}