import { fileToChars, fileToLines } from "../../utils/parsing";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords, BASIC_DIRS, VDir, HDir, UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const maze = new Matrix(await fileToChars(inputPath))
const start = maze.find('S')!
const end = maze.find('E')!

const calcTrack = (): [ trackTimes: Matrix<string | number>, path: Coords[]] => {
    const trackTimes = Matrix.create<string | number>(maze.rows, maze.cols, '#')
    trackTimes.set(end, 0)
    let path = [ end ]
    let from = end
    let d = 1
    while (!Arr.equals(from, start)) {
    
        for (const dir of BASIC_DIRS) {
            const nextTile = maze.move(from, dir[0], dir[1])

            if (maze.exists(nextTile) && maze.at(nextTile) !== '#' && trackTimes.at(nextTile) === '#') {
                from = nextTile
                path.push(nextTile)
                trackTimes.set(nextTile, d)
                break
            }
        }
        d += 1
    }

    return [trackTimes, path.reverse()]
}

const [trackTimes, track] = calcTrack()

console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const positionsByCheating = (from: Coords, moves: number): [Coords, number][] => {
    let candidates: [Coords, number][] = []

    const found = new Set()

    for (let i = 0; i <= moves; i++) {
        for (let j = 0; j <= moves - i; j++) {

            let d = i + j

            for (const [vdir, hdir] of [ UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT]) {
                const cand = trackTimes.move(
                    trackTimes.move(from, vdir, HDir.None, i), 
                    VDir.None, hdir, j
                )

                if (!trackTimes.exists(cand) || trackTimes.at(cand) === '#') continue
    
                let candHash = cand[0] * 1e8 + cand[1]
                if (!found.has(candHash)) {
                    candidates.push([cand, d])
                    found.add(candHash)
                }
            }
        }
    }

    return candidates
    

}

let tot = 0

// At each track position, check all the position that can be reached by cheating and calc the diff between the track times
for (const trackPosition of track) {
    const startDistance = trackTimes.at(trackPosition) as number

    for (const [cheatPosition, distance] of positionsByCheating(trackPosition, 2)) {
        const endDistance = trackTimes.at(cheatPosition) as number
        
        if (startDistance - endDistance - distance >= 100) tot += 1
    }
}

console.log("Part1 answer is:", tot)
console.timeEnd('Part1')

// Part 2
console.time('Part2')

tot = 0

// At each track position, check all the position that can be reached by cheating and calc the diff between the track times
for (const trackPosition of track) {
    const startDistance = trackTimes.at(trackPosition) as number

    for (const [cheatPosition, distance] of positionsByCheating(trackPosition, 20)) {
        const endDistance = trackTimes.at(cheatPosition) as number
        
        if (startDistance - endDistance - distance >= 100) tot += 1
    }
}

console.log("Part2 answer is:", tot)
console.timeEnd('Part2')

