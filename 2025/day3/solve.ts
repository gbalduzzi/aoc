import { fileToChars, fileToDigits, read } from "../../utils/parsing";
import * as N from "../../utils/numbers";

console.time("Parsing");

const inputPath = import.meta.dir + "/input.txt";

const batteries = await fileToDigits(inputPath);

console.timeEnd("Parsing");

console.time("Part1");

const tot = batteries.reduce((tot, bank) => {
  let tens = bank[bank.length - 2];
  let unit = bank[bank.length - 1];

  for (let i = bank.length - 3; i >= 0; i--) {
    if (bank[i] >= tens) {
      unit = Math.max(tens, unit);
      tens = bank[i];
    }
  }
  return tot + tens * 10 + unit;
}, 0);

console.timeEnd("Part1");
console.log("Part1 answer is:", tot);

console.time("Part2");

const tot2 = batteries.reduce((tot, bank) => {
  let candidates = bank.slice(bank.length - 12);

  for (let i = bank.length - 13; i >= 0; i--) {
    let j = 0;
    let available = bank[i];

    while (j < candidates.length && available >= candidates[j]) {
      let newAvailable = candidates[j];
      candidates[j] = available;
      available = newAvailable;
      j++;
    }
  }
  return tot + parseInt(candidates.join(""));
}, 0);

console.timeEnd("Part2");
console.log("Part2 answer is:", tot2);
