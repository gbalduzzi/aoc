import * as Att from "../../utils/arrays";
import { Coords, Matrix } from "../../utils/matrix";
import * as N from "../../utils/numbers";
import { fileToChars, fileToLines } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const grid = new Matrix(await fileToChars(inputPath))

const freqs = new Set<string>()

for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
        if (grid.at([i, j]) !== '.') {
            freqs.add(grid.at([i, j]))
        }
    } 
}

console.timeEnd('Parsing')


// Part 1
console.time('Part1')


let antinodes = new Set<string>()
for(const freq of freqs) {
    const ants = grid.findAll(freq)
    
    for (let i = 0; i < ants.length - 1; i++) {
        for (let j = i+1; j < ants.length; j++) {

            const rowDiff = ants[j][0] - ants[i][0]
            const colDiff = ants[j][1] - ants[i][1]

            let cand1: Coords = [ants[j][0] + rowDiff, ants[j][1] + colDiff]
            if (grid.exists(cand1)) {
                antinodes.add(JSON.stringify(cand1))
            }

            let cand2: Coords = [ants[i][0] - rowDiff, ants[i][1] - colDiff]
            if (grid.exists(cand2)) {
                antinodes.add(JSON.stringify(cand2))
            }
        }
    }
}

console.timeEnd('Part1')
console.log("Part1 answer is:", antinodes.size)

// Part 2
console.time('Part2')


antinodes = new Set<string>()
for(const freq of freqs) {
    const ants = grid.findAll(freq)
    
    for (let i = 0; i < ants.length - 1; i++) {
        for (let j = i+1; j < ants.length; j++) {
            antinodes.add(JSON.stringify(ants[i]))
            antinodes.add(JSON.stringify(ants[j]))

            const rowDiff = ants[j][0] - ants[i][0]
            const colDiff = ants[j][1] - ants[i][1]

            let cand1: Coords = [ants[j][0] + rowDiff, ants[j][1] + colDiff]
            while (grid.exists(cand1)) {
                antinodes.add(JSON.stringify(cand1))
                cand1[0] += rowDiff
                cand1[1] += colDiff
            }

            let cand2: Coords = [ants[i][0] - rowDiff, ants[i][1] - colDiff]
            while (grid.exists(cand2)) {
                antinodes.add(JSON.stringify(cand2))
                cand2[0] -= rowDiff
                cand2[1] -= colDiff
            }
        }
    }
}


console.timeEnd('Part2')
console.log("Part2 answer is:", antinodes.size)
