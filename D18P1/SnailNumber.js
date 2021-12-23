export default class SnailNumber {
  constructor(numberString, depth) {
    // first remove outer brackets
    numberString = numberString.slice(1);
    numberString = numberString.slice(0, -1);
    this.depth = depth;

    const pairs = findPairs(numberString).filter(pair => pair !== ',');
    if (pairs.length) {
      console.log(pairs);
      this.left = new SnailNumber(pairs[0], depth + 1);
      this.right = new SnailNumber(pairs[1], depth + 1);
    }
  }
}

function reduce() {
  if (this.depth >= 4) {}
}

function findPairs(str) {
  let pairStartIdx = 0;
  let openCount = 0;
  let pairs = [];
  for (let idx = 0; idx < str.length; ++idx) {
    if (str[idx] === '[') openCount++;
    if (str[idx] === ']') openCount--;
    if (openCount === 0) {
      // this is a pair
      pairs.push(str.slice(pairStartIdx, idx + 1));
      pairStartIdx = idx + 1;
    }
  }
  return pairs;
}
