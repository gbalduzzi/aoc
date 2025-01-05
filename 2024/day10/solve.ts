import { fileToChars, fileToLines, read } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const grid = await fileToChars(inputPath)
const map = new Matrix<number | string>(grid)

for (let i = 0; i < map.rows; i++) {
    for (let j = 0; j < map.cols; j++) {
        map.grid[i][j] = parseInt(map.grid[i][j] as string)
    }
} 

// Part 1
console.time('Part1')

const heads = map.findAll(0)
let tot = 0
for (const head of heads) {
    const reached = new Set<string>()

    let paths = [ head ]
    for (let i = 1; i < 10; i++) {
        let nextPaths: Coords[] = [ ]

        for (const path of paths) {
            const candidates = map.around(path)

            for (const candidate of candidates) {
                if (map.at(candidate) === i) nextPaths.push(candidate)
            }
        }

        paths = nextPaths
        if (paths.length === 0) break
    }

    paths.forEach(path => reached.add(path[0] + '-' + path[1]))

    tot += reached.size

}

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)

// Part 2
console.time('Part2')

tot = 0
for (const head of heads) {
    let paths = [ head ]
    for (let i = 1; i < 10; i++) {
        let nextPaths: Coords[] = [ ]

        for (const path of paths) {
            const candidates = map.around(path)

            for (const candidate of candidates) {
                if (map.at(candidate) === i) nextPaths.push(candidate)
            }
        }

        paths = nextPaths
        if (paths.length === 0) break
    }
    tot += paths.length

}

console.timeEnd('Part2')
console.log("Part2 answer is:", tot)
