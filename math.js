export const FLOAT_MATCH_THRESHOLD = 1e-5;

export function calculatePointMidpoint(p1, p2) {
  // return {x: , y: , z:, } midpoint between the two
  let mid = {};
  for (let key in p1) {
    if (p1[key] != undefined && p2[key] != undefined) { mid[key] = (p1[key] + p2[key]) / 2 }
  }
  return mid
}

export function calculatePointDistance(p1, p2) {
  // calculates distance between two {x:, y: , ...} points
  const p1Keys = Object.keys(p1);
  const p2Keys = Object.keys(p2);

  const availableKeys = p1Keys.filter(key => p2Keys.includes(key));

  let sqSum = 0;
  for (let key of availableKeys) {
    sqSum += (p2[key] - p1[key]) * (p2[key] - p1[key]);
  }

  return Math.sqrt(sqSum);
}

export function vectorMagnitude(vec) {
  let runningMag = 0;
  for (let key in vec) {
    runningMag += vec[key] * vec[key];
  }
  return Math.sqrt(runningMag);
}

export function vectorCrossProduct(v1, v2) {
  // return v1 cross v2
  // both v1 and v2 in form {x: , y: , z: }
  const x = v1.y * v2.z - v2.y * v1.z;
  const y = -(v1.x * v2.z - v2.x * v1.z);
  const z = v1.x * v2.y - v2.x * v1.y;

  return { x, y, z }
}

export function vectorSubtract(v1, v2) {
  // return v1 - v2
  // both v1 and v2 in form {x: ,y: ,z: }
  return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }
}

export function vectorAdd(v1, v2) {
  // return v1 + v2
  // both v1 and v2 in form {x: ,y: ,z: }
  let newPoint = { x: v1.x + v2.x, y: v1.y + v2.y};
  if (typeof v1.z === 'number' && typeof v2.z === 'number') {
    newPoint.z =  v1.z + v2.z;
  }
  return newPoint;
}

export function vectorScale(v1, s) {
  // return v1 * s (scalar distribution of s)
  // // v1 in form {x: ,y: ,z: }, s is a number
  let newPoint = { x: v1.x * s, y: v1.y * s};
  if (typeof v1.z === 'number') {
    newPoint.z = v1.z * s;
  }
  return newPoint
}

export function vectorNormalize(vec) {
  const vecMag = vectorMagnitude(vec);

  // if magnitude is 0, just return the vector since it's unscalable
  if (vecMag < FLOAT_MATCH_THRESHOLD) {
    return vec
  }
  return vectorScale(vec, 1 / vecMag);
}

export function vectorDotProduct(v1, v2) {
  // return v1 dot v2
  // both v1 and v2 in form {x: ,y: ,z: }
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
}

export function findPlaneIntersectionOfLine(plane, line) {
  // line in form of {point: , dir: }
  // https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection

  const p0 = plane.point;
  const l0 = line.point;
  const l = line.dir;
  const n = plane.dir;

  const lDotN = vectorDotProduct(l, n);
  if (Math.abs(lDotN) < 1e-5) {
    // either no intersection (parallel) or the line and plane are coincident.
    // For our math, this really shouldn't happen
    // console.error('Invalid projection from 3D point to plane');
    return null;
  }

  const d = vectorDotProduct(vectorSubtract(p0, l0), n) / lDotN;

  return vectorAdd(l0, vectorScale(l, d));
}

export function calculatePlanePointNormalDistance(plane, point) {
  const planePoint = findPlaneIntersectionOfLine(plane, {point, dir: plane.dir});
  return calculatePointDistance(point, planePoint);
}