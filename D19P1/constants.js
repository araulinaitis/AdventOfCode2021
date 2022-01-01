import * as math from 'mathjs';

const degToRad = Math.PI / 180;
let scannerAngles = [];
for (let xRot = 0; xRot < 4; ++xRot) {
  for (let yRot = 0; yRot < 4; ++yRot) {
    for (let zRot = 0; zRot < 4; ++zRot) {
      scannerAngles.push({ x: xRot * 90, y: yRot * 90, z: zRot * 90 });
    }
  }
}

const SCANNER_ORIENTATIONS = [];
let angleMap = {};

for (let angleSet of scannerAngles) {
  const cb = Math.cos(angleSet.x * degToRad);
  const sb = Math.sin(angleSet.x * degToRad);
  const cg = Math.cos(angleSet.y * degToRad);
  const sg = Math.sin(angleSet.y * degToRad);
  const ca = Math.cos(angleSet.z * degToRad);
  const sa = Math.sin(angleSet.z * degToRad);

  const rotMat = math.matrix([
    [Math.round(ca * cb), Math.round(ca * sb * sg - sa * cg), Math.round(ca * sb * cg + sa * sg)],
    [Math.round(sa * cb), Math.round(sa * sb * sg + ca * cg), Math.round(sa * sb * cg - ca * sg)],
    [Math.round(-sb), Math.round(cb * sg), Math.round(cb * cg)],
  ]);

  const [[a, b, c], [d, e, f], [g, h, i]] = rotMat._data;

  const matStr = a.toString() + b.toString() + c.toString() + d.toString() + e.toString() + f.toString() + g.toString() + h.toString() + i.toString();

  if (!angleMap[matStr]) {
    angleMap[matStr] = true;
    SCANNER_ORIENTATIONS.push(angleSet);
  }
}

// console.log(SCANNER_ORIENTATIONS.length);

export { SCANNER_ORIENTATIONS };
