import { fileToChars, fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import { Matrix } from "../../utils/fast_matrix";

console.time("Parsing");

const inputPath = import.meta.dir + "/input.txt";

const grid = Matrix.fromGrid(await fileToChars(inputPath));

console.timeEnd("Parsing");

console.time("Part1");

let tot = 0;
for (let i = 0; i < grid.rows; i++) {
  for (let j = 0; j < grid.cols; j++) {
    if (grid.at(i, j) !== "@") continue;

    let found = grid.around(i, j).filter((v) => v === "@").length;

    if (found < 4) tot++;
  }
}

console.timeEnd("Part1");
console.log("Part1 answer is:", tot);

console.time("Part2");

// Start creating a secondary grid, in each point we store the number of @ around it

let countGrid = Matrix.create(grid.rows, grid.cols, -1);

for (let i = 0; i < grid.rows; i++) {
  for (let j = 0; j < grid.cols; j++) {
    if (grid.at(i, j) !== "@") {
      continue;
    }
    countGrid.set(i, j, grid.around(i, j).filter((v) => v === "@").length);
  }
}

let tot2 = 0;
while (true) {
  let toRemove: number[] = [];

  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      const idx = grid.idx(i, j);

      if (grid.atIdx(idx) !== "@") continue;

      if (countGrid.atIdx(idx) < 4) {
        toRemove.push(idx);
      }
    }
  }

  if (toRemove.length === 0) {
    break;
  }

  tot2 += toRemove.length;

  toRemove.forEach((idx) => {
    grid.setIdx(idx, ".");

    countGrid.idxsAround(idx).forEach((toEdit) => {
      countGrid.setIdx(toEdit, countGrid.atIdx(toEdit) - 1);
    });
  });
}

console.timeEnd("Part2");
console.log("Part2 answer is:", tot2);
