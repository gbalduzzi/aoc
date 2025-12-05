import { fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";

console.time("Parsing");

const inputPath = import.meta.dir + "/input.txt";

const lines = await fileToLines(inputPath);

const ranges: [number, number][] = [];
const ingredients: number[] = [];
let i = 0;
for (; i < lines.length; i++) {
  if (lines[i] === "") break;
  ranges.push(lines[i].split("-").map((v) => Number(v)) as [number, number]);
}

for (; i < lines.length; i++) {
  ingredients.push(Number(lines[i]));
}

ranges.sort((a, b) => a[0] - b[0]);
ingredients.sort((a, b) => a - b);

console.timeEnd("Parsing");

console.time("Part1");

let ingrIdx = 0;
let rangeIdx = 0;

let tot = 0;
while (ingrIdx < ingredients.length && rangeIdx < ranges.length) {
  const ingr = ingredients[ingrIdx];
  const range = ranges[rangeIdx];

  if (ingr > range[1]) {
    rangeIdx++;
    continue;
  }

  ingrIdx++;
  if (ingr >= range[0]) tot++;
}
console.timeEnd("Part1");
console.log("Part1 answer is:", tot);

console.time("Part2");

i = 0; // idx of the range we are considering now
let j = 1; // idx of the next range we are considering to merge into i

let tot2 = 0;
while (i < ranges.length) {
  const range = ranges[i];
  const next = ranges[j] ?? null;

  if (next && range[1] >= next[0]) {
    // merge next into range
    range[1] = Math.max(range[1], next[1]);
    j++;
    continue;
  }
  // Can't merge with next, move to next
  tot2 += range[1] - range[0] + 1;

  i = j;
  j++;
}

console.timeEnd("Part2");
console.log("Part2 answer is:", tot2);
