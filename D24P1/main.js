import * as fs from 'fs/promises';

let inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
// let inputData = (await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

// console.log(inputData);

let registers = { w: 0, x: 0, y: 0, z: 0 };

let functions = {};
let input = [];

functions.inp = a => {
  registers[a] = parseInt(input[0]);
  input = input.slice(1);
};

functions.add = (a, b) => (registers[a] = registers[a] + (!isNaN(parseInt(b)) ? parseInt(b) : registers[b]));

functions.mul = (a, b) => (registers[a] = registers[a] * (!isNaN(parseInt(b)) ? parseInt(b) : registers[b]));

functions.div = (a, b) => (registers[a] = Math.floor(registers[a] / (!isNaN(parseInt(b)) ? parseInt(b) : registers[b])));

functions.mod = (a, b) => (registers[a] = registers[a] % (!isNaN(parseInt(b)) ? parseInt(b) : registers[b]));

functions.eql = (a, b) => (registers[a] = registers[1] == (!isNaN(parseInt(b)) ? parseInt(b) : registers[b]) ? 1 : 0);

let saveInput = '';
// input = '13579246899999';
// for(let op of inputData) {
//   functions[op[0]](op[1], op?.[2]);
//   console.log(registers);
// }

for (let d1 = 9; d1 > 0; d1--) {
  for (let d2 = 9; d2 > 0; d2--) {
    for (let d3 = 9; d3 > 0; d3--) {
      for (let d4 = 9; d4 > 0; d4--) {
        for (let d5 = 9; d5 > 0; d5--) {
          for (let d6 = 9; d6 > 0; d6--) {
            for (let d7 = 9; d7 > 0; d7--) {
              for (let d8 = 9; d8 > 0; d8--) {
                for (let d9 = 9; d9 > 0; d9--) {
                  for (let d10 = 9; d10 > 0; d10--) {
                    for (let d11 = 9; d11 > 0; d11--) {
                      for (let d12 = 9; d12 > 0; d12--) {
                        for (let d13 = 9; d13 > 0; d13--) {
                          for (let d14 = 9; d14 > 0; d14--) {
                            input =
                              d1.toString() +
                              d2.toString() +
                              d3.toString() +
                              d4.toString() +
                              d5.toString() +
                              d6.toString() +
                              d7.toString() +
                              d8.toString() +
                              d9.toString() +
                              d10.toString() +
                              d11.toString() +
                              d12.toString() +
                              d13.toString() +
                              d14.toString();

                              saveInput = JSON.parse(JSON.stringify(input));

                            for (let op of inputData) {
                              functions[op[0]](op[1], op?.[2]);
                              // console.log(registers);
                            }
                            if (registers.z === 0) console.log(saveInput);
                            // if (registers.z === 0) break;
                          }
                          // if (registers.z === 0) break;
                        }
                        // if (registers.z === 0) break;
                      }
                      // if (registers.z === 0) break;
                    }
                    // if (registers.z === 0) break;
                  }
                  // if (registers.z === 0) break;
                }
                // if (registers.z === 0) break;
              }
              // if (registers.z === 0) break;
            }
            // if (registers.z === 0) break;
          }
          // if (registers.z === 0) break;
        }
        // if (registers.z === 0) break;
      }
      // if (registers.z === 0) break;
    }
    // if (registers.z === 0) break;
  }
  // if (registers.z === 0) break;
}

// console.log(saveInput);
