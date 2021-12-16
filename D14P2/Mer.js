export default class Mer {
  constructor(chemicalString) {
    this.name = chemicalString;
    this.der0 = {};
    this.der1 = {};
    this.inFinalChain = 0;
  }

  buildMap(rules, polymerMap) {
    const newChar = rules[this.name];
    this.der0 = polymerMap[this.name.charAt(0) + newChar];
    this.der1 = polymerMap[this.name.charAt(1) + newChar];
  }

  runMap(numSteps) {
    if (numSteps === 0) {
      this.inFinalChain++;
      return;
    }
    this.der0.runMap(numSteps - 1);
    this.der1.runMap(numSteps - 1);
  }

  extractFreqs(freqs) {
    freqs[this.name.charAt(1)] += this.inFinalChain;
  }
}
