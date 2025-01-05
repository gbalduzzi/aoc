import { fileToLines } from "../../utils/parsing";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords, BASIC_DIRS } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

const coords = lines.map((line) => line.split(',').map(c => parseInt(c)).reverse()) as unknown as Coords[]

const R = 71, C = 71
const STEPS = 1024

const mem = Matrix.create(R, C, '.')


console.timeEnd('Parsing')

// Part 1
console.time('Part1')


for (let i = 0; i < STEPS; i++) {
    mem.set(coords[i], '#')
}

const END = [ R - 1, C - 1] as Coords

const solveMaze = (n: number): number | null => {

    const pathFinding = Matrix.create(R, C, 0)

    for (let i = 0; i < n; i++) {
        pathFinding.set(coords[i], +Infinity)
    }

    let toCheck = [ [0, 0] as Coords ]
    pathFinding.set([0, 0], 1)

    let i = 0
    while (toCheck.length > 0) {
        i++
        let next: Coords[] = [ ]
        for(const tile of toCheck) {
            for (const dir of BASIC_DIRS) {
                const nextTile = pathFinding.move(tile, dir[0], dir[1])
                if (pathFinding.exists(nextTile) && pathFinding.at(nextTile) === 0) {
                    if (Arr.equals(nextTile, END)) return i
                    pathFinding.set(nextTile, i)
                    next.push(nextTile)
                }
            }
        }

        toCheck = next
    }

    return null
}   

console.log("Part1 answer is:", solveMaze(STEPS))
console.timeEnd('Part1')

// Part 2
console.time('Part2')

let i = STEPS + 1
for (; i <= coords.length; i++) {
    if (solveMaze(i) === null) break
}

console.log("Part2 answer is:", coords[i-1].reverse())
console.timeEnd('Part2')

