import {
  findPlaneIntersectionOfLine,
  FLOAT_MATCH_THRESHOLD,
  vectorCrossProduct,
  vectorDotProduct,
  vectorMagnitude,
  vectorNormalize,
  vectorSubtract,
  calculatePointMidpoint,
} from '../math.js';

export default class Face {
  constructor(points, positiveVolume = true) {
    // points in ccw order
    this.points = points;
    this.positiveVolume = positiveVolume;
    if (!positiveVolume) {
      this.points.reverse();
      // this.normal = vectorScale(this.normal, -1, -1, -1);
    }
    this.normal = vectorNormalize(vectorCrossProduct(vectorSubtract(points[1], points[0]), vectorSubtract(points[2], points[0])));
    this.midpoint = calculatePointMidpoint(this.points[0], this.points[2]);
  }

  checkIntersection(point) {
    const line = { point, dir: { x: 1, y: 0, z: 0 } };
    const plane = { point: this.points[0], dir: this.normal };
    if (this.isPointOnFace(point)) return true;
    if (Math.abs(vectorDotProduct(vectorNormalize(line.dir), vectorNormalize(plane.dir))) < FLOAT_MATCH_THRESHOLD) {
      // console.log('early exit');
      return false;
    }
    if (this.points[0].x < line.point.x) return false;
    const intersection = findPlaneIntersectionOfLine(plane, line);

    if (!intersection) return false;

    // now check intersection is within bounds of this plane points
    // check the volume of the triangles created from all 4 points to the intersection point compared to the original face
    // if it's more, then the intersection is outside

    // console.log({point, points: this.points, intersection})
    let thisArea = 0;
    thisArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[1], this.points[0]), vectorSubtract(this.points[2], this.points[0]))) / 2;
    thisArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[2], this.points[0]), vectorSubtract(this.points[3], this.points[0]))) / 2;

    let intersectArea = 0;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[0], intersection), vectorSubtract(this.points[1], intersection))) / 2;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[1], intersection), vectorSubtract(this.points[2], intersection))) / 2;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[2], intersection), vectorSubtract(this.points[3], intersection))) / 2;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[3], intersection), vectorSubtract(this.points[0], intersection))) / 2;

    // if(point.x == -44 && point.y == 21 && point.z == 35) {
    //   console.log({point, points: this.points, intersection, thisArea, intersectArea, isIn: intersectArea < (thisArea + FLOAT_MATCH_THRESHOLD)})
    // }
    return intersectArea < thisArea + FLOAT_MATCH_THRESHOLD;
  }

  isPointOnFace(point) {
    const pointVec = vectorSubtract(point, this.points[0]);
    const dotProduct = vectorDotProduct(pointVec, this.normal);
    return Math.abs(dotProduct) < FLOAT_MATCH_THRESHOLD;
  }

  isCoincident(plane) {
    const isParallel = Math.abs(Math.abs(vectorDotProduct(this.normal, plane.dir)) - 1) < FLOAT_MATCH_THRESHOLD;
    const isOnFace = Math.abs(vectorDotProduct(vectorSubtract(plane.point, this.points[0]), this.normal)) < FLOAT_MATCH_THRESHOLD;

    return isParallel && isOnFace;
  }

  printAsObj() {
    return this.positiveVolume ? `f ${this.points[0].globalIdx + 1} ${this.points[1].globalIdx + 1} ${this.points[2].globalIdx + 1} ${this.points[3].globalIdx + 1}\n` : '';
  }

  printAsObjSolo() {
    return `f ${this.points[0].localIdx + 1} ${this.points[1].localIdx + 1} ${this.points[2].localIdx + 1} ${this.points[3].localIdx + 1}\n`;
  }

  includesPoint(point) {
    const vec = vectorNormalize(vectorSubtract(point, this.points[0]));
    return Math.abs(vectorDotProduct(vec, this.normal) < FLOAT_MATCH_THRESHOLD);
  }
}
