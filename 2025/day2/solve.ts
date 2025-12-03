import { read } from "../../utils/parsing";
import * as N from "../../utils/numbers";

console.time("Parsing");

const inputPath = import.meta.dir + "/input.txt";

const ranges = (await read(inputPath))
  .split(",")
  .map((range) => range.split("-").map((v) => parseInt(v)) as [number, number]);

console.timeEnd("Parsing");

console.time("Part1");

/* 
First  working (but slower) attempt, without using gauss formula for arithmetic progression
let tot = ranges.reduce((tot, range) => {
  const len = range[0].toString().length;

  let leftHalf;

  if (len % 2 == 1) {
    leftHalf = 10 ** Math.floor(len / 2);
  } else {
    leftHalf = Math.floor(range[0] / 10 ** len / 2);
  }

  while (true) {
    const combined = leftHalf * 10 ** leftHalf.toString().length + leftHalf;

    leftHalf += 1;

    if (combined > range[1]) {
      break;
    }

    if (combined < range[0]) {
      continue;
    }

    tot += combined;
  }

  return tot;
}, 0);
*/

let tot = ranges.reduce((tot, [min, max]) => {
  const minLen = N.digits(min);
  const maxLen = N.digits(max);

  let len = minLen % 2 === 0 ? minLen : minLen + 1;

  while (len <= maxLen) {
    let half = len / 2; // Always integer, I only care about even lengths
    let coeff = 10 ** half + 1; // Given an half, produces the full number, e.g len = 4, half = 45, 45 * 101 = 4545

    // Theorical minHalf e maxHalf for the given length
    let minHalf = 10 ** (half - 1); // len => 4, half => 2, minHalf => 10
    let maxHalf = 10 ** half - 1; // len => 4, half => 2, maxHalf => 99

    // Actual minHalf and maxHalf given the required range
    minHalf = Math.max(minHalf, Math.ceil(min / coeff)); // 4548 / 101 => 46, 4523 / 101 => 45
    maxHalf = Math.min(maxHalf, Math.floor(max / coeff)); // 4548 / 101 => 45, 4523 / 101 => 44

    if (minHalf <= maxHalf) {
      // gauss formula to find sum of a progression

      const count = maxHalf - minHalf + 1;
      const halvesSum = ((minHalf + maxHalf) * count) / 2;

      tot += halvesSum * coeff;
    }

    len += 2;
  }

  return tot;
}, 0);

console.timeEnd("Part1");
console.log("Part1 answer is:", tot);

// Generic function to find invalids ids for a variable number of splits, based on p1 solution
// The main difference is that instead of finding the sum using gauss formula,
// All invalids ids are returned using a set. This is required to avoid having ids counted on multiple split numbers
const invalidIds = ([min, max]: [number, number], n: number = 2): number[] => {
  let res: number[] = [];

  const minLen = N.digits(min);
  const maxLen = N.digits(max);

  // minumum valid length with n as a dividend
  let len = n * Math.ceil(minLen / n);

  while (len <= maxLen) {
    let splitLen = len / n;

    let coeff = 1;
    for (let i = 1; i < n; i++) {
      coeff = coeff * 10 ** splitLen + 1;
    }

    // Theorical minHalf e maxHalf for the given length
    let minSplit = 10 ** (splitLen - 1); // len => 4, half => 2, minHalf => 10
    let maxSplit = 10 ** splitLen - 1; // len => 4, half => 2, maxHalf => 99

    // Actual minHalf and maxHalf given the required range
    minSplit = Math.max(minSplit, Math.ceil(min / coeff)); // 4548 / 101 => 46, 4523 / 101 => 45
    maxSplit = Math.min(maxSplit, Math.floor(max / coeff)); // 4548 / 101 => 45, 4523 / 101 => 44

    for (let i = minSplit; i <= maxSplit; i++) {
      res.push(i * coeff);
    }

    len += n;
  }

  return res;
};

console.time("Part2");

let tot2 = ranges.reduce((tot, range) => {
  const maxLength = N.digits(range[1]);
  let invalids = new Set<number>();
  for (let i = 2; i <= maxLength; i++) {
    invalidIds(range, i).forEach((id) => invalids.add(id));
  }
  invalids.forEach((id) => (tot += id));
  return tot;
}, 0);
console.timeEnd("Part2");
console.log("Part2 answer is:", tot2);
