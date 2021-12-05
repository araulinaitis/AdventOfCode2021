export default class Line {
  constructor(p1, p2) {
    // p1 and p2 in form [x, y] (also x and y are strings at this point)
    this.p1 = { x: parseInt(p1[0]), y: parseInt(p1[1]) };
    this.p2 = { x: parseInt(p2[0]), y: parseInt(p2[1]) };

    this.isVertical = this.p1.x === this.p2.x;
    this.isHorizontal = this.p1.y === this.p2.y;

    this.coveredPixels = [];

    this.minX = Math.min(this.p1.x, this.p2.x);
    this.maxX = Math.max(this.p1.x, this.p2.x);
    this.minY = Math.min(this.p1.y, this.p2.y);
    this.maxY = Math.max(this.p1.y, this.p2.y);
    
    if (!this.isVertical && !this.isHorizontal) return;

    // calculate pixels that are covered by this line
    if (this.isVertical) {
      const x = this.p1.x;
      for (let y = Math.min(this.p1.y, this.p2.y); y <= Math.max(this.p1.y, this.p2.y); y = Math.round(y + 1)) {
        this.coveredPixels.push({ x, y });
      }
    } else {
      const y = this.p1.y;
      for (let x = Math.min(this.p1.x, this.p2.x); x <= Math.max(this.p1.x, this.p2.x); x = Math.round(x + 1)) {
        this.coveredPixels.push({ x, y });
      }
    }

  }
}
