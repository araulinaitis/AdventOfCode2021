export default class Beacon {
  constructor(coords, parent) {
    this.parent = parent;
    const [x, y, z] = coords;
    this.pos = { x, y, z };
    this.distanceToParent = Math.sqrt(x * x + y * y + z * z);
    this.neighborBeacons = [];
    this.potentialTwins = [];
  }

  buildDistances(beacons) {
    for (let beacon of beacons) {
      if (beacon === this) continue;
      const dx = this.pos.x - beacon.pos.x;
      const dy = this.pos.y - beacon.pos.y;
      const dz = this.pos.z - beacon.pos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      this.neighborBeacons.push({ beacon, dist });
    }
  }

  rotate(rotation) {
    const degToRad = Math.PI / 180;
    const cx = Math.cos(rotation.x * degToRad);
    const sx = Math.sin(rotation.x * degToRad);
    const cy = Math.cos(rotation.y * degToRad);
    const sy = Math.sin(rotation.y * degToRad);
    const cz = Math.cos(rotation.z * degToRad);
    const sz = Math.sin(rotation.z * degToRad);

    let { x: x0, y: y0, z: z0 } = this.pos;

    // X rotate
    {
      const x = x0;
      const y = y0 * cx - z0 * sx;
      const z = y0 * sx + z0 * cx;

      x0 = x;
      y0 = y;
      z0 = z;
    }

    // Y rotate
    {
      const x = x0 * cy + z0 * sy;
      const y = y0;
      const z = -x0 * sy + z0 * cy;

      x0 = x;
      y0 = y;
      z0 = z;
    }
    
    // Z rotate
    {
      const x = x0 * cz - y0 * sz;
      const y = x0 * sz + y0 * cz;
      const z = z0;

      x0 = x;
      y0 = y;
      z0 = z;
    }

    this.pos = { x: x0, y: y0, z: z0 };
  }

  translate(offset) {
    this.pos = { x: this.pos.x + offset.x, y: this.pos.y + offset.y, z: this.pos.z + offset.z };
  }

  translateInverse(offset) {
    this.pos = { x: this.pos.x - offset.x, y: this.pos.y - offset.y, z: this.pos.z - offset.z };
  }

  isCoincident(beacon) {
    const tol = 1e-5;
    return Math.abs(beacon.pos.x - this.pos.x) < tol && Math.abs(beacon.pos.y - this.pos.y) < tol && Math.abs(beacon.pos.z - this.pos.z) < tol;
  }

  merge(otherBeacon, scanners) {
    // for (let newNeighbor of beacon.parent.beacons.filter())
    otherBeacon.parent.replaceBeacon(otherBeacon, this);
    for (let neighborInfo of otherBeacon.neighborBeacons) {
      neighborInfo.beacon.replaceBeacon(otherBeacon, this);
    }
    for (let scanner of scanners) {
      scanner.replaceBeacon(otherBeacon, this);
    }
  }

  addNeighbors(newNeighbors) {
    for (let newNeighbor of newNeighbors) {
      if (!this.neighborBeacons.map(neighborInfo => neighborInfo.beacon).includes(newNeighbor)) {
        this.neighborBeacons.push(newNeighbor);
      }
    }
  }

  replaceBeacon(oldBeacon, newBeacon) {
    for (let neighbor of this.neighborBeacons) {
      if (neighbor.beacon === oldBeacon) neighbor.beacon = newBeacon;
    }
  }

  checkSame(otherBeacon) {
    if (this === otherBeacon) return { sameCount: 0 };
    // check how many overlapping beacons there are (i.e. same distance away) in the neighbors of both beacons
    let sameCount = 0;
    for (let neighborInfo of this.neighborBeacons) {
      for (let otherNeighborInfo of otherBeacon.neighborBeacons) {
        if (Math.abs(neighborInfo.dist - otherNeighborInfo.dist) < 1e-5) {
          sameCount++;
          // break;
        }
      }
    }

    return sameCount;
  }

  combineByMatchCount(count, scanners) {
    for (let beaconInfo of this.potentialTwins) {
      if (beaconInfo.sameCount === count) {
        console.log(`merging ${beaconInfo.beacon.parent.scannerNum} - ${beaconInfo.beacon.beaconNum} into ${this.parent.scannerNum} - ${this.beaconNum}`);
        this.merge(beaconInfo.beacon, scanners);
        for (let beaconPair of beaconInfo.sameBeacons) {
          beaconPair.beacon1.merge(beaconPair.beacon2, scanners);
        }
        this.potentialTwins = [];
        return true;
      }
    }
    return false;
  }

  resetPotentialTwins() {
    this.potentialTwins = [];
  }
}
