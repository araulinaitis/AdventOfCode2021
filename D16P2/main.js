import * as fs from 'fs/promises';

// let inputData = await fs.readFile('./data/input.csv', { encoding: 'UTF-8' });
let inputData = await fs.readFile('./data/testData.csv', { encoding: 'UTF-8' });
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
  0: sum,
  1: product,
  2: minimum,
  3: maximum,
  4: parsePacketedNumber,
  5: greaterThan,
  6: lessThan,
  7: equalTo,
};

inputData = inputData
  .split('')
  .map(char => hexMap[char])
  .join('');

parsePacket(inputData);

function parsePacket(data) {
  console.log({ 'packet Data': data });
  const packetVersionInfo = parseFixedNumber(data, 3);
  const packetVersion = binToDec(packetVersionInfo.number);
  data = packetVersionInfo.data;
  console.log({ packetVersion });

  const packetTypeIdInfo = parseFixedNumber(data, 3);
  const packetTypeId = binToDec(packetTypeIdInfo.number);
  data = packetTypeIdInfo.data;
  console.log({ packetTypeId });
  const res = packetTypeFunctions?.[packetTypeId](data);
  console.log(res);
  return { output: res.output, data: res.data };
}

function parseOperator(data) {
  console.log('parsing Operator Packet');
  console.log({ 'packet Data': data });
  const lengthTypeInfo = parseFixedNumber(data, 1);
  const lengthTypeId = lengthTypeInfo.number;
  data = lengthTypeInfo.data;
  let outputStrings = [];

  if (lengthTypeId == 0) {
    const parsedNext = parseFixedNumber(data, 15);
    const subPacketLength = binToDec(parsedNext.number);
    data = parsedNext.data;
    console.log({ subPacketLength, data });
    const parsedSubPacketInfo = parseFixedNumber(data, subPacketLength);
    let subPacket = parsedSubPacketInfo.number;
    data = parsedSubPacketInfo.data;
    console.log({ subPacket });
    while (subPacket.length) {
      console.log('Parsing Inner Packet');
      const newInfo = parsePacket(subPacket);
      outputStrings.push(newInfo.output);
      subPacket = newInfo.data;
      console.log('Done Parsing Inner Packet');
      console.log({ subPacket });
    }
  } else {
    const parsedNext = parseFixedNumber(data, 11);
    const numSubPackets = binToDec(parsedNext.number);
    console.log({ numSubPackets });
    data = parsedNext.data;
    for (let i = 0; i < numSubPackets; ++i) {
      console.log('Parsing Subpacket');
      const newInfo = parsePacket(data);
      outputStrings.push(newInfo.output);
      data = newInfo.data;
      console.log('Done Parsing Subpacket');
    }
  }
  return { output: outputStrings, data };
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

function sum(data) {
  const { output, data: paredData } = parseOperator(data);
  console.log(`Parsing sum of ${binToDec(output[0])} and ${binToDec(output[1])}`);
  return { output: output.map(str => binToDec(str)).reduce((prev, cur) => prev + cur), data: paredData };
}

function product(data) {
  const { output, data: paredData } = parseOperator(data);
  console.log(`Parsing product of ${binToDec(output[0])} and ${binToDec(output[1])}`);
  return { output: output.map(str => binToDec(str)).reduce((prev, cur) => prev * cur), data: paredData };
}

function minimum(data) {
  const { output, data: paredData } = parseOperator(data);
  console.log(`Parsing minimum of ${binToDec(output[0])} and ${binToDec(output[1])}`);
  return { output: Math.min(...output.map(str => binToDec(str))), data: paredData };
}

function maximum(data) {
  const { output, data: paredData } = parseOperator(data);
  console.log(`Parsing maximum of ${binToDec(output[0])} and ${binToDec(output[1])}`);
  return { output: Math.max(...output.map(str => binToDec(str))), data: paredData };
}

function greaterThan(data) {
  const { output, data: paredData } = parseOperator(data);
  console.log(`Parsing is ${binToDec(output[0])} greater than ${binToDec(output[1])}`);
  return { output: binToDec(output[0]) > binToDec(output[1]) ?? -Infinity ? 1 : 0, data: paredData };
}

function lessThan(data) {
  const { output, data: paredData } = parseOperator(data);
  console.log(`Parsing is ${binToDec(output[0])} less than ${binToDec(output[1])}`);
  return { output: binToDec(output[0]) < binToDec(output[1]) ?? Infinity ? 1 : 0, data: paredData };
}

function equalTo(data) {
  const { output, data: paredData } = parseOperator(data);
  console.log(`Parsing is ${binToDec(output[0])} equal to ${binToDec(output[1])}`);
  return { output: binToDec(output[0]) == binToDec(output[1]) ? 1 : 0, data: paredData };
}

function binToDec(binStr) {
  if (!binStr) return 0;
  if (typeof binStr === 'number') return binStr
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
