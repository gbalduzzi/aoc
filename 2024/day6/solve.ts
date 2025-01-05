import { equals, unique } from "../../utils/arrays";
import { HDir, Matrix, VDir, Coords } from "../../utils/matrix";
import { fileToChars } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const map = new Matrix(await fileToChars(inputPath))

console.timeEnd('Parsing')

// Part 1
console.time('Part1')

function turnRight(fromDir: [VDir, HDir]): [VDir, HDir] {
    if (fromDir[0] === VDir.Up) {
       return [VDir.None, HDir.Right]
    } else if (fromDir[0] === VDir.Down) {
       return [VDir.None, HDir.Left]
    } else if (fromDir[1] === HDir.Left) {
        return [VDir.Up, HDir.None]
    } else if (fromDir[1] === HDir.Right) {
        return [VDir.Down, HDir.None]
    } 
    
    return fromDir
}

const initPos = map.find('^')!
let pos = initPos
map.set(pos, '.')

const initDir: [VDir, HDir] = [VDir.Up, HDir.None]
let dir = initDir

const visited = new Set<string>([ JSON.stringify(pos) ])
const path: Coords[] = []

while (true) {
    let next = map.move(pos, dir[0], dir[1])

    if (!map.exists(next)) {
        break ;
    }

    if (map.at(next) === '#') {
        dir = turnRight(dir)
        continue
    }

    visited.add(JSON.stringify(next))
    path.push(next)
    pos = next

}

console.timeEnd('Part1')
console.log("Part1 answer is:", visited.size)

// Part 2
console.time('Part2')
let tot = 0
for(const point of unique(path, equals)) {

    if (point[0] === initPos[0] && point[1] === initPos[1]) continue

    map.set(point, '#')

    pos = initPos
    dir = initDir
    let loopCheck = new Set<string>([ JSON.stringify([pos, dir]) ]) 

    while (true) {
        let next = map.move(pos, dir[0], dir[1])

        if (!map.exists(next)) {
            break;
        }

        if (map.at(next) === '#') {
            dir = turnRight(dir)
            continue
        }

        const loopKey = JSON.stringify([next, dir])

        if (loopCheck.has(loopKey)) {
            tot += 1
            break
        }
        loopCheck.add(loopKey)
        pos = next

    }

    map.set(point, '.')
}

console.timeEnd('Part2')
console.log("Part2 answer is:", tot)
