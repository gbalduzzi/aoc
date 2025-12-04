import { fileToLines } from "../utils/parsing";
import * as N from "../utils/numbers";

console.time("Parsing");

const inputPath = import.meta.dir + "/input.txt";

const line = await fileToLines(inputPath);

console.timeEnd("Parsing");

console.time("Part1");

console.timeEnd("Part1");
console.log("Part1 answer is:", 0);

console.time("Part2");

console.timeEnd("Part2");
console.log("Part2 answer is:", 0);
