import * as fs from 'fs/promises';

const inputData = (await fs.readFile('./data/input.csv', { encoding: 'UTF-8' })).split('\r\n');
