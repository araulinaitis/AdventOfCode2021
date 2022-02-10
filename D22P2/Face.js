import {
  findPlaneIntersectionOfLine,
  FLOAT_MATCH_THRESHOLD,
  vectorCrossProduct,
  vectorDotProduct,
  vectorMagnitude,
  vectorNormalize,
  vectorSubtract,
  calculatePointMidpoint,
  vectorScale,
} from '../math.js';

export default class Face {
  constructor(points, positiveVolume = true, normal) {
    // points in ccw order
    this.points = points;
    this.positiveVolume = positiveVolume;
    if (!positiveVolume) {
      this.points.reverse();
    }
    if (positiveVolume) {
      this.normal = normal ?? vectorNormalize(vectorCrossProduct(vectorSubtract(points[1], points[0]), vectorSubtract(points[2], points[0])));
    } else {
      this.normal = normal ? vectorScale(normal, -1) : vectorNormalize(vectorCrossProduct(vectorSubtract(points[1], points[0]), vectorSubtract(points[2], points[0])));
    }
    this.midpoint = calculatePointMidpoint(this.points[0], this.points[2]);
    this.minX = Math.min(...points.map(point => point.x));
    this.minY = Math.min(...points.map(point => point.y));
    this.minZ = Math.min(...points.map(point => point.z));
    this.maxX = Math.max(...points.map(point => point.x));
    this.maxY = Math.max(...points.map(point => point.y));
    this.maxZ = Math.max(...points.map(point => point.z));

    if (Math.abs(this.normal.x) < FLOAT_MATCH_THRESHOLD && Math.abs(this.normal.y) < FLOAT_MATCH_THRESHOLD && Math.abs(this.normal.z) < FLOAT_MATCH_THRESHOLD) {
      console.log(this);
    }
  }

  checkIntersection(point) {
    const line = { point, dir: { x: 1, y: 0, z: 0 } };
    const plane = { point: this.points[0], dir: this.normal };
    if (this.isPointOnFace(point)) return true;
    if (Math.abs(vectorDotProduct(vectorNormalize(line.dir), vectorNormalize(plane.dir))) < FLOAT_MATCH_THRESHOLD) {
      return false;
    }
    if (this.points[0].x < line.point.x) return false;
    const intersection = findPlaneIntersectionOfLine(plane, line);

    if (!intersection) return false;

    // now check intersection is within bounds of this plane points
    // check the volume of the triangles created from all 4 points to the intersection point compared to the original face
    // if it's more, then the intersection is outside

    let thisArea = 0;
    thisArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[1], this.points[0]), vectorSubtract(this.points[2], this.points[0]))) / 2;
    thisArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[2], this.points[0]), vectorSubtract(this.points[3], this.points[0]))) / 2;

    let intersectArea = 0;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[0], intersection), vectorSubtract(this.points[1], intersection))) / 2;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[1], intersection), vectorSubtract(this.points[2], intersection))) / 2;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[2], intersection), vectorSubtract(this.points[3], intersection))) / 2;
    intersectArea += vectorMagnitude(vectorCrossProduct(vectorSubtract(this.points[3], intersection), vectorSubtract(this.points[0], intersection))) / 2;

    return intersectArea < thisArea + FLOAT_MATCH_THRESHOLD;
  }

  isPointOnFace(point) {
    return (
      point.x >= this.minX - FLOAT_MATCH_THRESHOLD &&
      point.x <= this.maxX + FLOAT_MATCH_THRESHOLD &&
      point.y >= this.minY - FLOAT_MATCH_THRESHOLD &&
      point.y <= this.maxY + FLOAT_MATCH_THRESHOLD &&
      point.z >= this.minZ - FLOAT_MATCH_THRESHOLD &&
      point.z <= this.maxZ + FLOAT_MATCH_THRESHOLD
    );
  }

  isCoincident(plane) {
    const isParallel = Math.abs(Math.abs(vectorDotProduct(this.normal, plane.dir)) - 1) < FLOAT_MATCH_THRESHOLD;
    const isOnFace = Math.abs(vectorDotProduct(vectorSubtract(plane.point, this.points[0]), this.normal)) < FLOAT_MATCH_THRESHOLD;

    return isParallel && isOnFace;
  }

  printAsObj() {
    return this.positiveVolume ? `f ${this.points[0].globalIdx} ${this.points[1].globalIdx} ${this.points[2].globalIdx} ${this.points[3].globalIdx}\n` : '';
  }

  printAsObjSolo() {
    return `f ${this.points[0].localIdx} ${this.points[1].localIdx} ${this.points[2].localIdx} ${this.points[3].localIdx}\n`;
  }
}
