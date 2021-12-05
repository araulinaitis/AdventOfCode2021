export default class Line {
  constructor(p1, p2) {
    // p1 and p2 in form [x, y] (also x and y are strings at this point)
    this.p1 = { x: parseInt(p1[0]), y: parseInt(p1[1]) };
    this.p2 = { x: parseInt(p2[0]), y: parseInt(p2[1]) };

    this.isVertical = this.p1.x === this.p2.x;
    this.isHorizontal = this.p1.y === this.p2.y;
    this.isDiagonal = Math.round((Math.max(this.p1.y, this.p2.y) - Math.min(this.p1.y, this.p2.y)) / (Math.max(this.p1.x, this.p2.x) - Math.min(this.p1.x, this.p2.x))) === 1;

    this.coveredPixels = [];

    this.minX = Math.min(this.p1.x, this.p2.x);
    this.maxX = Math.max(this.p1.x, this.p2.x);
    this.minY = Math.min(this.p1.y, this.p2.y);
    this.maxY = Math.max(this.p1.y, this.p2.y);

    // calculate pixels that are covered by this line
    const xDir = this.p2.x > this.p1.x ? 1 : -1;
    const yDir = this.p2.y > this.p1.y ? 1 : -1;

    if (this.isVertical) {
      const x = this.p1.x;
      for (let y = this.p1.y; y !== this.p2.y; y = Math.round(y + yDir)) {
        this.coveredPixels.push({ x, y });
      }
      this.coveredPixels.push({ x: this.p2.x, y: this.p2.y });
    } else if (this.isHorizontal) {
      const y = this.p1.y;
      for (let x = this.p1.x; x !==  this.p2.x; x = Math.round(x + xDir)) {
        this.coveredPixels.push({ x, y });
      }
      this.coveredPixels.push({ x: this.p2.x, y: this.p2.y });
    } else if (this.isDiagonal) {
      let y = this.p1.y;
      for (let x = this.p1.x; x !==  this.p2.x; x = Math.round(x + xDir)) {
        this.coveredPixels.push({ x, y });
        y = Math.round(y + yDir);
      }
      this.coveredPixels.push({ x: this.p2.x, y: this.p2.y });
    }
  }
}
