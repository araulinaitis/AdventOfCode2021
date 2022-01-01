import * as fs from 'fs/promises';
import Scanner from './Scanner.js';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' }))
  .split(/--- scanner [0-9]+ ---/)
  .map(row => row.split('\r\n').map(row => row.split(',')))
  .slice(1)
  .map(entry => entry.map(row => row.filter(subRow => subRow !== '')).filter(row => row.length))
  .map(entry => entry.map(row => row.map(val => parseInt(val))));

// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' }))
//   .split(/--- scanner [0-9] ---/)
//   .map(row => row.split('\r\n').map(row => row.split(',')))
//   .slice(1)
//   .map(entry => entry.map(row => row.filter(subRow => subRow !== '')).filter(row => row.length))
//   .map(entry => entry.map(row => row.map(val => parseInt(val))));

console.log(inputData.length);

let scanners = [];
let scannerNum = 0;
for (let entry of inputData) {
  const newScanner = new Scanner(entry, scannerNum);
  newScanner.buildBeaconDistances();
  scanners.push(newScanner);
  scannerNum++;
}

while (scanners.some(scanner => scanner.offsetFrom0 === null)) {
  for (let thisScanner of scanners) {
    if (!thisScanner.offsetFrom0) continue;
    for (let otherScanner of scanners) {
      if (thisScanner === otherScanner || otherScanner.offsetFrom0) continue;
      thisScanner.alignToThis(otherScanner, scanners);
    }
  }
  console.log(scanners.map(scanner => scanner.offsetFrom0));
}

let uniqueBeacons = [scanners[0].beacons[0]];
for (let scanner of scanners) {
  for (let beacon of scanner.beacons) {
    if (!uniqueBeacons.some(uniqueBeacon => beacon.isCoincident(uniqueBeacon))) {
      uniqueBeacons.push(beacon);
    }
  }
}
console.log(uniqueBeacons.length);
