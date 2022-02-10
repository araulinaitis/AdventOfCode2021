import Edge from './Edge.js';
import Face from './Face.js';
import { calculatePointDistance, calculatePointMidpoint, FLOAT_MATCH_THRESHOLD, vectorAdd, vectorDotProduct, vectorScale } from '../math.js';

export default class Prism {
  constructor(x1, y1, z1, x2, y2, z2, state) {
    this.c1 = { x: Math.min(x1, x2), y: Math.min(y1, y2), z: Math.min(z1, z2) };
    this.c2 = { x: Math.max(x1, x2), y: Math.max(y1, y2), z: Math.max(z1, z2) };

    x1 = this.c1.x;
    x2 = this.c2.x;
    y1 = this.c1.y;
    y2 = this.c2.y;
    z1 = this.c1.z;
    z2 = this.c2.z;

    this.midpoint = calculatePointMidpoint(this.c1, this.c2);
    const corners = [
      { x: x1, y: y1, z: z1 },
      { x: x1, y: y1, z: z2 },
      { x: x1, y: y2, z: z1 },
      { x: x1, y: y2, z: z2 },
      { x: x2, y: y1, z: z1 },
      { x: x2, y: y1, z: z2 },
      { x: x2, y: y2, z: z1 },
      { x: x2, y: y2, z: z2 },
    ];

    this.corners = corners;
    this.edges = [
      new Edge(corners[0], corners[1]),
      new Edge(corners[0], corners[2]),
      new Edge(corners[0], corners[4]),
      new Edge(corners[1], corners[3]),
      new Edge(corners[1], corners[5]),
      new Edge(corners[2], corners[3]),
      new Edge(corners[2], corners[6]),
      new Edge(corners[3], corners[7]),
      new Edge(corners[4], corners[5]),
      new Edge(corners[4], corners[6]),
      new Edge(corners[5], corners[7]),
      new Edge(corners[6], corners[7]),
    ];

    this.state = state === 'on' || state === true;

    const normals = [
      { x: -1, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
    ];

    this.faces = [
      new Face([corners[0], corners[1], corners[3], corners[2]], this.state, normals[0]),
      new Face([corners[0], corners[4], corners[5], corners[1]], this.state, normals[1]),
      new Face([corners[4], corners[6], corners[7], corners[5]], this.state, normals[2]),
      new Face([corners[2], corners[3], corners[7], corners[6]], this.state, normals[3]),
      new Face([corners[1], corners[5], corners[7], corners[3]], this.state, normals[4]),
      new Face([corners[0], corners[2], corners[6], corners[4]], this.state, normals[5]),
    ];
  }

  intersect(otherPrism) {
    let internalPoints = [];
    for (let [otherIdx, otherPoint] of otherPrism.corners.entries()) {
      if (this.checkPointInside(otherPoint)) internalPoints.push({ point: otherPoint, idx: otherIdx });
    }

    if (internalPoints.length) {
      let prisms = [this];
      for (let internalPointInfo of internalPoints) {
        for (let dir of otherPrism.calculatePointOutwardVectors(internalPointInfo.idx)) {
          let idx = 0;
          while (idx < prisms.length) {
            const prism = prisms[idx];
            const plane = { point: internalPointInfo.point, dir };
            const newPrisms = prism.splitByPlane(plane);
            if (newPrisms.length > 1) {
              prisms.splice(idx, 1, ...newPrisms);
            } else {
              idx++;
            }
          }
        }
      }
      // check new prisms and exclude those inside the intersecting prism
      prisms = prisms.filter(prism => !otherPrism.checkPointInside(prism.midpoint));

      let lastNumPrisms = 0;
      while (prisms.length !== lastNumPrisms) {
        lastNumPrisms = prisms.length;
        let thisIdx = 0;
        while (thisIdx < prisms.length - 1) {
          let nextIdx = thisIdx + 1;
          while (nextIdx < prisms.length) {
            if (prisms[thisIdx].canCombine(prisms[nextIdx])) {
              const newPrism = prisms[thisIdx].combine(prisms[nextIdx]);
              prisms.splice(thisIdx, 1, newPrism);
              prisms.splice(nextIdx, 1);
            } else {
              nextIdx++;
            }
          }
          thisIdx++;
        }
      }
      return prisms;
    }

    // if no points inside, check if a face of the other prism intersects this prism and split along that face
    // can just split this prism by all of the planes of the other prism until we get one
    let prisms = [this];
    for (let otherFace of otherPrism.faces) {
      let idx = 0;
      while (idx < prisms.length) {
        const prism = prisms[idx];
        const plane = { point: otherFace.midpoint, dir: otherPrism.state ? otherFace.normal : vectorScale(otherFace.normal, -1) };
        const newPrisms = prism.splitByPlane(plane);
        if (newPrisms.length > 1) {
          prisms.splice(idx, 1, ...newPrisms);
          idx += newPrisms.length;
        } else {
          idx++;
        }
      }
    }

    prisms = prisms.filter(prism => !otherPrism.checkPointInside(prism.midpoint));

    let lastNumPrisms = 0;
    while (prisms.length !== lastNumPrisms) {
      lastNumPrisms = prisms.length;
      let thisIdx = 0;
      while (thisIdx < prisms.length - 1) {
        let nextIdx = thisIdx + 1;
        while (nextIdx < prisms.length) {
          if (prisms[thisIdx].canCombine(prisms[nextIdx])) {
            const newPrism = prisms[thisIdx].combine(prisms[nextIdx]);
            prisms.splice(thisIdx, 1, newPrism);
            prisms.splice(nextIdx, 1);
          } else {
            nextIdx++;
          }
        }
        thisIdx++;
      }
    }
    return prisms;
  }

  combine(prism) {
    const minX = Math.min(...[...this.corners.map(point => point.x), ...prism.corners.map(point => point.x)]);
    const minY = Math.min(...[...this.corners.map(point => point.y), ...prism.corners.map(point => point.y)]);
    const minZ = Math.min(...[...this.corners.map(point => point.z), ...prism.corners.map(point => point.z)]);
    const maxX = Math.max(...[...this.corners.map(point => point.x), ...prism.corners.map(point => point.x)]);
    const maxY = Math.max(...[...this.corners.map(point => point.y), ...prism.corners.map(point => point.y)]);
    const maxZ = Math.max(...[...this.corners.map(point => point.z), ...prism.corners.map(point => point.z)]);

    const newPrism = new Prism(minX, minY, minZ, maxX, maxY, maxZ, this.state);
    return newPrism;
  }

  canCombine(prism) {
    if (this.state !== prism.state) return false;
    const offsets = [
      { x: -0.5, y: -0.5, z: -0.5 },
      { x: -0.5, y: -0.5, z: 0.5 },
      { x: -0.5, y: 0.5, z: -0.5 },
      { x: -0.5, y: 0.5, z: 0.5 },
      { x: 0.5, y: -0.5, z: -0.5 },
      { x: 0.5, y: -0.5, z: 0.5 },
      { x: 0.5, y: 0.5, z: -0.5 },
      { x: 0.5, y: 0.5, z: 0.5 },
    ];

    let matchPoints = 0;
    for (let [thisCornerIdx, thisCorner] of this.corners.entries()) {
      for (let [otherCornerIdx, otherCorner] of prism.corners.entries()) {
        matchPoints +=
          Math.abs(calculatePointDistance(vectorAdd(thisCorner, offsets[thisCornerIdx]), vectorAdd(otherCorner, offsets[otherCornerIdx]))) < FLOAT_MATCH_THRESHOLD ? 1 : 0;
        if (matchPoints >= 4) return true;
      }
    }
    return false;
  }

  calculatePointOutwardVectors(idx) {
    const outwardVecs = [
      [
        { x: -1, y: 0, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: -1 },
      ],
      [
        { x: -1, y: 0, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 },
      ],
      [
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: -1 },
      ],
      [
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: 1 },
      ],
      [
        { x: 1, y: 0, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: -1 },
      ],
      [
        { x: 1, y: 0, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 },
      ],
      [
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: -1 },
      ],
      [
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: 1 },
      ],
    ];
    return outwardVecs[idx];
  }

  checkPointInside(point) {
    return (
      point.x >= this.c1.x - FLOAT_MATCH_THRESHOLD &&
      point.x <= this.c2.x + FLOAT_MATCH_THRESHOLD &&
      point.y >= this.c1.y - FLOAT_MATCH_THRESHOLD &&
      point.y <= this.c2.y + FLOAT_MATCH_THRESHOLD &&
      point.z >= this.c1.z - FLOAT_MATCH_THRESHOLD &&
      point.z <= this.c2.z + FLOAT_MATCH_THRESHOLD
    );
  }

  splitByPlane(plane) {
    let newPoints = [];
    for (let edge of this.edges) {
      if (Math.abs(vectorDotProduct(edge.dir, plane.dir)) < FLOAT_MATCH_THRESHOLD) continue;
      // const newPoint = edge.intersectPlane(plane);
      const oldPoint = edge.intersectPlane(plane);
      // console.log({ oldPoint });
      if (oldPoint) {
        newPoints.push(oldPoint);
        const newPoint = vectorAdd(oldPoint, plane.dir);
        if (
          newPoint.x >= this.c1.x - FLOAT_MATCH_THRESHOLD &&
          newPoint.x <= this.c2.x + FLOAT_MATCH_THRESHOLD &&
          newPoint.y >= this.c1.y - FLOAT_MATCH_THRESHOLD &&
          newPoint.y <= this.c2.y + FLOAT_MATCH_THRESHOLD &&
          newPoint.z >= this.c1.z - FLOAT_MATCH_THRESHOLD &&
          newPoint.z <= this.c2.z + FLOAT_MATCH_THRESHOLD
        ) {
          newPoints.push(newPoint);
        }
      }
    }

    if (newPoints.length === 0) return [this];

    function orderSort(val1, val2) {
      if (val1 == val2) return 0;
      return val1 < val2 ? -1 : 1;
    }
    function filterUnique(point, idx, self) {
      return self.indexOf(point) === idx;
    }

    const xValsFromCorners = [this.c1.x, this.c2.x];
    const yValsFromCorners = [this.c1.y, this.c2.y];
    const zValsFromCorners = [this.c1.z, this.c2.z];

    const xValsFromNewPoints = newPoints.map(point => Math.round(point.x)).filter(filterUnique);
    const yValsFromNewPoints = newPoints.map(point => Math.round(point.y)).filter(filterUnique);
    const zValsFromNewPoints = newPoints.map(point => Math.round(point.z)).filter(filterUnique);

    const xVals = [...xValsFromCorners, ...(Math.abs(plane.dir.x) < FLOAT_MATCH_THRESHOLD ? [] : xValsFromNewPoints)].sort(orderSort);
    const yVals = [...yValsFromCorners, ...(Math.abs(plane.dir.y) < FLOAT_MATCH_THRESHOLD ? [] : yValsFromNewPoints)].sort(orderSort);
    const zVals = [...zValsFromCorners, ...(Math.abs(plane.dir.z) < FLOAT_MATCH_THRESHOLD ? [] : zValsFromNewPoints)].sort(orderSort);

    let newPrisms = [];
    for (let xIdx = 0; xIdx < xVals.length - 1; xIdx += 2) {
      const xPair = [xVals[xIdx], xVals[xIdx + 1]];
      for (let yIdx = 0; yIdx < yVals.length - 1; yIdx += 2) {
        const yPair = [yVals[yIdx], yVals[yIdx + 1]];
        for (let zIdx = 0; zIdx < zVals.length - 1; zIdx += 2) {
          const zPair = [zVals[zIdx], zVals[zIdx + 1]];
          newPrisms.push(new Prism(xPair[0], yPair[0], zPair[0], xPair[1], yPair[1], zPair[1], this.state));
        }
      }
    }
    return newPrisms;
  }

  assignGlobalPoints(globalPointArr, globalPointIdx) {
    const minMap = [
      { isMinX: true, isMinY: true, isMinZ: true },
      { isMinX: true, isMinY: true, isMinZ: false },
      { isMinX: true, isMinY: false, isMinZ: true },
      { isMinX: true, isMinY: false, isMinZ: false },
      { isMinX: false, isMinY: true, isMinZ: true },
      { isMinX: false, isMinY: true, isMinZ: false },
      { isMinX: false, isMinY: false, isMinZ: true },
      { isMinX: false, isMinY: false, isMinZ: false },
    ];
    for (let [pointIdx, point] of this.corners.entries()) {
      point.isMinX = minMap[pointIdx].isMinX;
      point.isMinY = minMap[pointIdx].isMinY;
      point.isMinZ = minMap[pointIdx].isMinZ;
      for (let globalPoint of globalPointArr) {
        if (
          Math.round(globalPoint.x) == Math.round(point.x) &&
          Math.round(globalPoint.y) == Math.round(point.y) &&
          Math.round(globalPoint.z) == Math.round(point.z) &&
          point.isMinX === globalPoint.isMinX &&
          point.isMinY === globalPoint.isMinY &&
          point.isMinZ === globalPoint.isMinZ
        ) {
          globalPoint.globalIdx;
          break;
        }
      }
      if (point.globalIdx === null || point.globalIdx === undefined) {
        globalPointArr.push(point);
        point.globalIdx = globalPointIdx;
        globalPointIdx++;
      }
    }
    return globalPointIdx;
  }

  printAsObj() {
    let obj = '';
    for (let face of this.faces) {
      obj += face.printAsObj();
    }
    return obj;
  }

  printAsObjSolo() {
    let obj = '';
    const minMap = [
      { isMinX: true, isMinY: true, isMinZ: true },
      { isMinX: true, isMinY: true, isMinZ: false },
      { isMinX: true, isMinY: false, isMinZ: true },
      { isMinX: true, isMinY: false, isMinZ: false },
      { isMinX: false, isMinY: true, isMinZ: true },
      { isMinX: false, isMinY: true, isMinZ: false },
      { isMinX: false, isMinY: false, isMinZ: true },
      { isMinX: false, isMinY: false, isMinZ: false },
    ];
    for (let [idx, point] of this.corners.entries()) {
      point.localIdx = idx + 1;
      obj += `v ${minMap[idx].isMinX ? point.x - 0.5 : point.x + 0.5} ${minMap[idx].isMinY ? point.y - 0.5 : point.y + 0.5} ${
        minMap[idx].isMinZ ? point.z - 0.5 : point.z + 0.5
      }\n`;
    }

    for (let face of this.faces) {
      obj += face.printAsObjSolo();
    }
    return obj;
  }

  calculateVolume() {
    const thisArea = this.state ? Math.abs(this.c2.x - this.c1.x + 1) * Math.abs(this.c2.y - this.c1.y + 1) * Math.abs(this.c2.z - this.c1.z + 1) : 0;
    return thisArea;
  }
}
