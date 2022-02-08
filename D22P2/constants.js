let counts = {};

for (let roll1 = 1; roll1 <= 3; ++roll1) {
  for (let roll2 = 1; roll2 <= 3; ++roll2) {
    for (let roll3 = 1; roll3 <= 3; ++roll3) {
      const totalOffset = roll1 + roll2 + roll3;
      if (!counts[totalOffset]) counts[totalOffset] = 0;
      counts[totalOffset]++;
    }
  }
}

export { counts };
