import { fileToChars, fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import { Matrix, Coords } from "../../utils/matrix";

console.time("Parsing");

const inputPath = import.meta.dir + "/input.txt";

const grid = new Matrix(await fileToChars(inputPath));

console.timeEnd("Parsing");

console.time("Part1");

let tot = 0;
for (let i = 0; i < grid.rows; i++) {
  for (let j = 0; j < grid.cols; j++) {
    if (grid.at([i, j]) !== "@") continue;

    let minRow = Math.max(0, i - 1);
    let maxRow = Math.min(grid.rows - 1, i + 1);

    let minCol = Math.max(0, j - 1);
    let maxCol = Math.min(grid.cols - 1, j + 1);

    let found = 0;
    // yes, we are deeply nested in 4 loops
    // but the internal one are maximum 3 iterations, can't be more
    for (let i2 = minRow; i2 <= maxRow; i2++) {
      for (let j2 = minCol; j2 <= maxCol; j2++) {
        if (grid.at([i2, j2]) === "@") found++;
      }
      if (found > 4) break;
    }

    if (found <= 4) tot++;
  }
}

console.timeEnd("Part1");
console.log("Part1 answer is:", tot);

console.time("Part2");

// Start creating a secondary grid, in each point we store the number of @ around it

let countGrid = Matrix.create(grid.rows, grid.cols, -1);

for (let i = 0; i < grid.rows; i++) {
  for (let j = 0; j < grid.cols; j++) {
    if (grid.at([i, j]) !== "@") {
      continue;
    }

    let minRow = Math.max(0, i - 1);
    let maxRow = Math.min(grid.rows - 1, i + 1);

    let minCol = Math.max(0, j - 1);
    let maxCol = Math.min(grid.cols - 1, j + 1);

    let found = 0;
    // yes, we are deeply nested in 4 loops
    // but the internal one are maximum 3 iterations, can't be more
    for (let i2 = minRow; i2 <= maxRow; i2++) {
      for (let j2 = minCol; j2 <= maxCol; j2++) {
        if (grid.at([i2, j2]) === "@") found++;
      }
    }

    countGrid.set([i, j], found);
  }
}

let tot2 = 0;
while (true) {
  let toRemove: Coords[] = [];

  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      let c: Coords = [i, j];
      if (grid.at(c) !== "@") continue;

      if (countGrid.at(c) <= 4) {
        toRemove.push(c);
      }
    }
  }

  if (toRemove.length === 0) {
    break;
  }

  tot2 += toRemove.length;

  toRemove.forEach((c) => {
    grid.set(c, ".");

    countGrid.around(c, true).forEach((toEdit) => {
      countGrid.set(toEdit, countGrid.at(toEdit) - 1);
    });
  });
}

console.timeEnd("Part2");
console.log("Part2 answer is:", tot2);
