import { read, toLines } from "../../utils/parsing";

console.time("Parsing");

const inputPath = import.meta.dir + "/input.txt";
const lines = toLines(await read(inputPath));

const offsets = lines.map((line) => {
  const coeff = line.startsWith("L") ? -1 : 1;

  return parseInt(line.substring(1)) * coeff;
});

console.timeEnd("Parsing");

console.time("Part1");

let pos = 50;
let count = 0;

offsets.forEach((offset) => {
  pos = pos + offset;
  if (pos % 100 == 0) count++;
});

console.timeEnd("Part1");
console.log("Part1 answer is:", count);

console.time("Part2");

// Compress offset, so that multiple sequences of same direction are united
// each new element WILL change direction
const compressed = offsets.reduce((acc, num) => {
  if (acc.length === 0 || Math.sign(acc[acc.length - 1]) !== Math.sign(num)) {
    acc.push(num);
  } else {
    acc[acc.length - 1] += num;
  }
  return acc;
}, [] as number[]);

pos = 50;
count = 0;
let last = 0;

compressed.forEach((offset) => {
  pos = pos + offset;
  const to = Math.floor(pos / 100);

  count += Math.abs(to - last);
  if (pos % 100 == 0) {
    // Controls that the stopped position is not counted twice, or never
    // This works because after compression each new offset will change direction
    count += offset >= 0 ? -1 : 1;
  }

  last = to;
});

console.timeEnd("Part2");
console.log("Part2 answer is:", count);
