import Beacon from './Beacon.js';
import { SCANNER_ORIENTATIONS } from './constants.js';

export default class Scanner {
  constructor(beaconArr, scannerNum) {
    this.scannerNum = scannerNum;
    this.beacons = [];
    for (let coords of beaconArr) {
      this.beacons.push(new Beacon(coords, this));
    }
    this.alignmentTo0 = scannerNum === 0 ? { x: 0, y: 0, z: 0 } : null;
    this.offsetFrom0 = scannerNum === 0 ? {x: 0, y: 0, z: 0} : null;
  }

  alignToThis(inputScanner, scanners) {
    for (let otherScannerOrientation of SCANNER_ORIENTATIONS) {
      const otherScanner = inputScanner.copy();
      otherScanner.rotate(otherScannerOrientation);

      for (let thisPotentialBeacon of this.beacons) {
        for (let otherPotentialBeacon of otherScanner.beacons) {
          if (thisPotentialBeacon === otherPotentialBeacon) continue;

          const otherBeaconOffset = {
            x: Math.round(thisPotentialBeacon.pos.x - otherPotentialBeacon.pos.x),
            y: Math.round(thisPotentialBeacon.pos.y - otherPotentialBeacon.pos.y),
            z: Math.round(thisPotentialBeacon.pos.z - otherPotentialBeacon.pos.z),
          };

          otherScanner.translate(otherBeaconOffset);

          // check how many overlap and if any beacons in range don't overlap
          // this count should match the highestMatchCounts above

          let thisMatchCount = 0;
          for (let thisBeacon of this.beacons) {
            for (let otherBeacon of otherScanner.beacons) {
              thisMatchCount += thisBeacon.isCoincident(otherBeacon) ? 1 : 0;
            }
          }

          if (thisMatchCount >= 12 && this.alignmentTo0) {
            inputScanner.alignmentTo0 = { x: otherScannerOrientation.x, y: otherScannerOrientation.y, z: otherScannerOrientation.z };
            inputScanner.offsetFrom0 = { x: otherBeaconOffset.x, y: otherBeaconOffset.y, z: otherBeaconOffset.z };

            // combine matched beacons so we can keep an overall count;
            inputScanner.rotate(inputScanner.alignmentTo0);
            inputScanner.translate(inputScanner.offsetFrom0);

            for (let thisBeacon of this.beacons) {
              for (let otherBeacon of inputScanner.beacons) {
                if (thisBeacon.isCoincident(otherBeacon)) {
                  thisBeacon.merge(otherBeacon, scanners);
                }
              }
            }

            return
          } else {
            otherScanner.translateInverse(otherBeaconOffset);
          }
        }
      }
    }
  }

  translate(offset) {
    for (let beacon of this.beacons) {
      beacon.translate(offset);
    }
  }

  translateInverse(offset) {
    for (let beacon of this.beacons) {
      beacon.translateInverse(offset);
    }
  }
  
  rotate(rotation) {
    for (let beacon of this.beacons) {
      beacon.rotate(rotation);
    }
  }

  copy() {
    const newScanner = new Scanner([], this.globalBeacons, this.scannerNum);
    for (let beacon of this.beacons) {
      const newBeacon = new Beacon([beacon.pos.x, beacon.pos.y, beacon.pos.z], newScanner, this.globalBeacons, beacon.beaconNum);
      newScanner.beacons.push(newBeacon);
    }
    newScanner.buildBeaconDistances();
    return newScanner;
  }

  buildBeaconDistances() {
    for (let beacon of this.beacons) {
      beacon.buildDistances(this.beacons);
    }
  }

  replaceBeacon(oldBeacon, newBeacon) {
    const oldBeaconIdx = this.beacons.indexOf(oldBeacon);
    // if (oldBeaconIdx > 0) this.beacons.splice(oldBeaconIdx, 1, newBeacon);
    this.beacons[oldBeaconIdx] = newBeacon;
  }

   checkOverlap(otherScanner) {
    let highestMatchCount = 0;
    for (let thisBeacon of this.beacons) {
      for (let otherBeacon of otherScanner.beacons) {
        if (thisBeacon === otherBeacon) continue;
        const thisMatchCount = thisBeacon.checkSame(otherBeacon);
        if (thisMatchCount > highestMatchCount) {
          highestMatchCount = thisMatchCount;
        }
      }
    }
    return highestMatchCount ;
  }

  combineBeacons(highestMatchCount, scanners) {
    for (let beacon of this.beacons) {
      const didCombine = beacon.combineByMatchCount(highestMatchCount, scanners);
      if (didCombine) return true;
    }
    return false;
  }
}
