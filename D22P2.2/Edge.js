import { findPlaneIntersectionOfLine, FLOAT_MATCH_THRESHOLD, vectorDotProduct, vectorSubtract, vectorNormalize, calculatePointDistance } from '../math.js';

export default class Edge {
  constructor(p1, p2) {
    this.points = [p1, p2];
    this.dir = vectorSubtract(p2, p1);
    this.length = calculatePointDistance(p1, p2);
  }

  intersectPlane(plane) {
    if (Math.abs(vectorDotProduct(vectorNormalize(plane.dir), vectorNormalize(this.dir))) < FLOAT_MATCH_THRESHOLD) return null;
    const iSectPoint = findPlaneIntersectionOfLine(plane, { point: this.points[0], dir: this.dir });
    // console.log({iSectPoint});
    return this.isOnEdge(iSectPoint) ? iSectPoint : null;
  }

  isOnEdge(point) {
    const d1 = calculatePointDistance(point, this.points[0]);
    const d2 = calculatePointDistance(this.points[1], point);
    return Math.abs(d1 + d2 - this.length) < FLOAT_MATCH_THRESHOLD;
  }
}
