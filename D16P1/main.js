import * as fs from 'fs/promises';

let inputData = await fs.readFile('./data/input.csv', { encoding: 'UTF-8' });
// let inputData = await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' });
// console.log(inputData);

const hexMap = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

const packetTypeFunctions = {
  default: parseOperator,
  4: parsePacketedNumber,
};

inputData = inputData
  .split('')
  .map(char => hexMap[char])
  .join('');

// console.log({inputData});
let verTot = 0;
parsePacket(inputData);

function parsePacket(data) {
  console.log({'packet Data': data});
  const packetVersionInfo = parseFixedNumber(data, 3);
  const packetVersion = binToDec(packetVersionInfo.number);
  data = packetVersionInfo.data;
  console.log({packetVersion});
  verTot += packetVersion;

  const packetTypeIdInfo = parseFixedNumber(data, 3);
  const packetTypeId = binToDec(packetTypeIdInfo.number);
  data = packetTypeIdInfo.data;
  console.log({packetTypeId});
  const res = (packetTypeFunctions?.[packetTypeId] || packetTypeFunctions.default)(data);
  // console.log(packetVersion, packetTypeId, output, data);
  return res.data;
}

console.log({verTot});

// console.log(packetVersion, packetTypeId, output, inputData);

function parseOperator(data) {
  console.log('parsing Operator Packet');
  console.log({'packet Data': data});
  const lengthTypeId = data.slice(0, 1);
  data = data.slice(1);

  if (lengthTypeId == 0) {
    const parsedNext = parseFixedNumber(data, 15);
    const subPacketLength = binToDec(parsedNext.number);
    data = parsedNext.data;
    console.log({subPacketLength, data});
    const parsedSubPacketInfo = parseFixedNumber(data, subPacketLength);
    let subPacket = parsedSubPacketInfo.number;
    data = parsedSubPacketInfo.data;
    while (subPacket.length) {
      subPacket = parsePacket(subPacket);
    }
  } else {
    const parsedNext = parseFixedNumber(data, 11);
    const numSubPackets = binToDec(parsedNext.number);
    console.log({numSubPackets})
    data = parsedNext.data;
    for (let i = 0; i < numSubPackets; ++i) {
      console.log('Parsing Subpacket');
      data = parsePacket(data);
    }
    console.log({numSubPackets, data});
  }
  return {output: [], data}
}

function parseFixedNumber(data, numChars) {
  const numStr = data.slice(0, numChars);
  data = data.slice(numChars);
  return { number: numStr, data };
}

function parsePacketedNumber(data) {
  console.log('parsing Number Packet');
  console.log({ 'packet Data': data });
  let readNumber = '';
  while (data.charAt(0) !== '0') {
    data = data.slice(1);
    readNumber += data.slice(0, 4);
    data = data.slice(4);
  }
  // last part happens after the 0
  data = data.slice(1);
  readNumber += data.slice(0, 4);
  data = data.slice(4);

  console.log({ readNumber: binToDec(readNumber), data });
  return { output: readNumber, data };
}

function binToDec(binStr) {
  let val = 0;
  let idx = binStr.length - 1;
  let exp = 0;
  while (idx >= 0) {
    val += parseInt(binStr[idx]) * Math.pow(2, exp);
    exp++;
    idx--;
  }
  return val;
}