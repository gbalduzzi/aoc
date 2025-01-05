import { fileToChars, fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords, BASIC_DIRS, DIR, turn, RIGHT, LEFT } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const maze = new Matrix(await fileToChars(inputPath))

console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const start = maze.find('S')!

type Path = { pos: Coords, dir: DIR, score: number, steps: Coords[]}

const posHash = (c: Coords) => c[0]*1e6+c[1]

const reorderPaths = () => paths.sort((a, b) => a.score - b.score) 

const isTileValid = (tile: Coords, score: number): boolean => {
    if (maze.at(tile) === '#') return false
    if (!visited.has(posHash(tile))) return true
    // Keep one turn as margin, we may be coming from a better direction
    return visited.get(posHash(tile))! > score - 1001 
}

let visited = new Map<number, number>()

visited.set(posHash(start), 1)

let paths: Path[] = [
    {
        pos: maze.move(start, LEFT[0], LEFT[1]),
        dir: RIGHT,
        score: -1,
        steps: []
    }
]

let bestScore: number | null = null
let bestPaths: Path[] = []

// Let's search for all good paths, useful for p2
while (paths.length > 0) {
    reorderPaths()

    const path = paths[0]

    if (bestScore !== null && path.score > bestScore) {
        paths.splice(0, 1)
        continue
    }

    if (maze.at(path.pos) === 'E') {
        bestScore = path.score
        bestPaths.push(path)
        paths.splice(0, 1)
        continue
    }

    const next = maze.move(path.pos, path.dir[0], path.dir[1])
    
    if (!isTileValid(next, path.score + 1)) {
        paths.splice(0, 1)
        continue
    }
    visited.set(posHash(next), path.score + 1)
    path.pos = next
    path.steps.push(next)
    path.score += 1

    const onRight = maze.move(next, ...turn(path.dir))
    const onRightHash = posHash(onRight)
    const onLeft = maze.move(next, ...turn(path.dir, false))
    const onLeftHash = posHash(onLeft)

    if (isTileValid(onRight, path.score + 1001)) {
        visited.set(onRightHash, path.score + 1001)
        paths.push({ 
            pos: onRight, 
            dir: turn(path.dir), 
            score: path.score + 1001,
            steps: [...path.steps, onRight]
        })
    }

    if (isTileValid(onLeft, path.score + 1001)) {
        visited.set(onLeftHash, path.score + 1001)
        paths.push({ 
            pos: onLeft, 
            dir: turn(path.dir, false), 
            score: path.score + 1001,
            steps: [...path.steps, onLeft]
        })
    }
}

console.log("Part1 answer is:", bestScore)
console.timeEnd('Part1')

// Part 2
console.time('Part2')

let valids = new Set<number>()

for (const path of bestPaths) {
    for (const step of path.steps) valids.add(posHash(step))
}

console.log("Part2 answer is:", valids.size)
console.timeEnd('Part2')