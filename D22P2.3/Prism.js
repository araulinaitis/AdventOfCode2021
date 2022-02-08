import Edge from './Edge.js';
import Face from './Face.js';
import { calculatePointMidpoint, FLOAT_MATCH_THRESHOLD, vectorAdd, vectorDotProduct, vectorMagnitude, vectorNormalize, vectorScale, vectorSubtract } from '../math.js';

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
    // console.log(state, this.state);
    // if (!this.state) {
    // console.log(this.state);
    // }

    this.faces = [
      new Face([corners[0], corners[1], corners[3], corners[2]], this.state),
      new Face([corners[0], corners[4], corners[5], corners[1]], this.state),
      new Face([corners[4], corners[6], corners[7], corners[5]], this.state),
      new Face([corners[2], corners[3], corners[7], corners[6]], this.state),
      new Face([corners[1], corners[5], corners[7], corners[3]], this.state),
      new Face([corners[0], corners[2], corners[6], corners[4]], this.state),
    ];
  }

  intersect(otherPrism) {
    let internalPoints = [];
    // console.log(this.corners, otherPrism.corners);
    for (let otherPoint of otherPrism.corners) {
      if (this.checkPointInside(otherPoint)) internalPoints.push(otherPoint);
    }

    // console.log({internalPoints: internalPoints.length});
    if (internalPoints.length) {
      let prisms = [this];
      for (let internalPoint of internalPoints) {
        // for (let dir of [
        //   { x: 1, y: 0, z: 0 },
        //   { x: 0, y: 1, z: 0 },
        //   { x: 0, y: 0, z: 1 },
        // ]) {
        for (let dir of otherPrism.calculatePointOutwardVectors(internalPoint)) {
          let idx = 0;
          while (idx < prisms.length) {
            const prism = prisms[idx];
            const plane = { point: internalPoint, dir };
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
      return prisms;
    }

    // if no points inside, check if a face of the other prism intersects this prism and split along that face
    // can just split this prism by all of the planes of the other prism until we get one
    let prisms = [this];
    for (let otherFace of otherPrism.faces) {
      let idx = 0;
      while (idx < prisms.length) {
        const prism = prisms[idx];
        const plane = { point: otherFace.midpoint, dir: otherFace.normal };
        // const plane = { point: vectorAdd(otherFace.midpoint, !otherPrism.state ? vectorScale(otherFace.normal, -1) : otherFace.normal), dir: otherFace.normal };
        // const plane = { point: vectorAdd(otherFace.midpoint, vectorScale(otherFace.normal, -1)), dir: otherFace.normal };
        // console.log(prism.corners, otherFace.points, plane);
        const newPrisms = prism.splitByPlane(plane);
        if (newPrisms.length > 1) {
          prisms.splice(idx, 1, ...newPrisms);
        } else {
          idx++;
        }
      }
    }

    prisms = prisms.filter(prism => !otherPrism.checkPointInside(prism.midpoint));
    return prisms;

    // return [this];
  }

  calculatePointOutwardVectors(point) {
    const outwardVec = vectorSubtract(point, this.midpoint);

    const outwardVecs = [
      { x: Math.sign(outwardVec.x), y: 0, z: 0 },
      { x: 0, y: Math.sign(outwardVec.y), z: 0 },
      { x: 0, y: 0, z: Math.sign(outwardVec.z) },
    ];
    return outwardVecs;
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
  // checkPointInside(point) {
  //   let intersectedFaces = 0;
  //   for (let face of this.faces) {
  //     intersectedFaces += face.checkIntersection(point) ? 1 : 0;
  //   }

  //   if (intersectedFaces % 2 !== 0) {
  //     // point is inside shape
  //     return true;
  //   }
  //   return false;
  // }

  splitByPlane(plane) {
    // plane.point = vectorAdd(plane.point, vectorNormalize(plane.dir));
    // if (calculatePointDistance(plane.point, this.midpoint) < calculatePointDistance(vectorAdd(plane.point, plane.dir), this.midpoint)) return [this];
    // if (this.faces.filter(face => face.isCoincident(plane)).length) return [this];

    // console.log({ plane });

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
          newPoint.x > this.c1.x - FLOAT_MATCH_THRESHOLD &&
          newPoint.x < this.c2.x + FLOAT_MATCH_THRESHOLD &&
          newPoint.y > this.c1.y - FLOAT_MATCH_THRESHOLD &&
          newPoint.y < this.c2.y + FLOAT_MATCH_THRESHOLD &&
          newPoint.z > this.c1.z - FLOAT_MATCH_THRESHOLD &&
          newPoint.z < this.c2.z + FLOAT_MATCH_THRESHOLD
        ) {
          if (newPoint) newPoints.push(newPoint);
        }
      }
    }

    if (newPoints.length === 0) return [this];

    // const points = [...this.corners, ...newPoints];
    // console.log({ originalPoints: this.corners, newPoints });

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

    const xValsFromNewPoints = newPoints.map(point => parseInt(point.x)).filter(filterUnique);
    const yValsFromNewPoints = newPoints.map(point => parseInt(point.y)).filter(filterUnique);
    const zValsFromNewPoints = newPoints.map(point => parseInt(point.z)).filter(filterUnique);

    // const xVals = [...xValsFromCorners, ...xValsFromNewPoints].sort(orderSort);
    // const yVals = [...yValsFromCorners, ...yValsFromNewPoints].sort(orderSort);
    // const zVals = [...zValsFromCorners, ...zValsFromNewPoints].sort(orderSort);
    // const xVals = [...xValsFromCorners, ...(xValsFromNewPoints.length === 1 ? xValsFromNewPoints : [])].sort(orderSort);
    // const yVals = [...yValsFromCorners, ...(yValsFromNewPoints.length === 1 ? yValsFromNewPoints : [])].sort(orderSort);
    // const zVals = [...zValsFromCorners, ...(zValsFromNewPoints.length === 1 ? zValsFromNewPoints : [])].sort(orderSort);
    const xVals = [...xValsFromCorners, ...(plane.dir.x == 0 ? [] : xValsFromNewPoints)].sort(orderSort);
    const yVals = [...yValsFromCorners, ...(plane.dir.y == 0 ? [] : yValsFromNewPoints)].sort(orderSort);
    const zVals = [...zValsFromCorners, ...(plane.dir.z == 0 ? [] : zValsFromNewPoints)].sort(orderSort);

    // console.log({ xValsFromCorners, xValsFromNewPoints });
    // console.log({ yValsFromCorners, yValsFromNewPoints });
    // console.log({ zValsFromCorners, zValsFromNewPoints });

    // const xVals = points
    //   .map(point => parseInt(point.x))
    //   .filter(filterUnique)
    //   .sort(orderSort);
    // const yVals = points
    //   .map(point => parseInt(point.y))
    //   .filter(filterUnique)
    //   .sort(orderSort);
    // const zVals = points
    //   .map(point => parseInt(point.z))
    //   .filter(filterUnique)
    //   .sort(orderSort);

    // console.log({ xVals, yVals, zVals });

    let newPrisms = [];
    for (let xIdx = 0; xIdx < xVals.length - 1; xIdx += 2) {
      const xPair = [xVals[xIdx], xVals[xIdx + 1]];
      for (let yIdx = 0; yIdx < yVals.length - 1; yIdx += 2) {
        const yPair = [yVals[yIdx], yVals[yIdx + 1]];
        for (let zIdx = 0; zIdx < zVals.length - 1; zIdx += 2) {
          const zPair = [zVals[zIdx], zVals[zIdx + 1]];
          // console.log({xPair, yPair, zPair})
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
      for (let [globalIdx, globalPoint] of globalPointArr.entries()) {
        if (parseInt(globalPoint.x) == parseInt(point.x) && parseInt(globalPoint.y) == parseInt(point.y) && parseInt(globalPoint.z) == parseInt(point.z)) {
          point.globalIdx = globalIdx;
        }
      }
      if (point.globalIdx == null || point.globalIdx == undefined) {
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
      point.localIdx = idx;
      obj += `v ${minMap[idx].isMinX ? point.x - 0.5 : point.x + 0.5} ${minMap[idx].isMinY ? point.y - 0.5 : point.y + 0.5} ${
        minMap[idx].isMinZ ? point.z - 0.5 : point.z + 0.5
      }\n`;
      // obj += `v ${point.x} ${point.y} ${point.z}\n`;
    }

    for (let face of this.faces) {
      obj += face.printAsObjSolo();
    }
    return obj;
  }

  calculateVolume() {
    const thisArea = this.state ? Math.abs(this.c2.x - this.c1.x + 1) * Math.abs(this.c2.y - this.c1.y + 1) * Math.abs(this.c2.z - this.c1.z + 1) : 0;
    // const thisArea = this.state ? Math.abs(this.c2.x - this.c1.x) * Math.abs(this.c2.y - this.c1.y) * Math.abs(this.c2.z - this.c1.z) : 0;
    // console.log(thisArea);
    return thisArea;
    // return Math.abs(this.c2.x - this.c1.x) * Math.abs(this.c2.y - this.c1.y) * Math.abs(this.c2.z - this.c1.z);
  }
}
