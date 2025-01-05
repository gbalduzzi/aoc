import { fileToLines, toChars } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords, HDir, VDir } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

const separation = lines.findIndex(l => l === '')

const grid = lines.slice(0, separation).map(toChars)

let map = new Matrix([...grid.map(row => [...row])])
const instrs = toChars(lines.slice(separation + 1).join(''))

console.timeEnd('Parsing')


const score = () => {
    return map.findAll(['O', '[']).reduce(
        (tot, box) => tot + box[0] * 100 + box[1],
        0
    )
}

// Part 1
console.time('Part1')

let pos = map.find('@')!
map.set(pos, '.')

const instToDir: {[key: string]: [VDir, HDir ]} = {
    '^': [ VDir.Up, HDir.None ],
    '>': [ VDir.None, HDir.Right ],
    'v': [ VDir.Down, HDir.None ],
    '<': [ VDir.None, HDir.Left ],
}

for(const inst of instrs) {
    const dir = instToDir[inst]

    const next = map.move(pos, dir[0], dir[1])

    if (!map.exists(next)) continue

    let to = [...next] as Coords

    while (map.exists(to) && map.at(to) === 'O') {
        to = map.move(to, dir[0], dir[1])
    }

    if (!map.exists(to)) continue
    if (map.at(to) === '#') continue

    map.set(to, 'O')
    map.set(next, '.')
    pos = next

}


console.log("Part1 answer is:", score())
console.timeEnd('Part1')

// Part 2
console.time('Part2')

// Reset map to original positions

const expandedGrid = grid.map(row => {
    const newRow = new Array()

    row.forEach(tile => {
        if (tile === '#') newRow.push('#', '#')
        if (tile === 'O') newRow.push('[', ']')
        if (tile === '@') newRow.push('@', '.')
        if (tile === '.') newRow.push('.', '.')
    })

    return newRow
})
map = new Matrix(expandedGrid)

const otherBoxTile = (tile: Coords): Coords => {
    if (map.at(tile) === '[') 
        return map.move(tile, VDir.None, HDir.Right)
    if (map.at(tile) === ']') 
        return map.move(tile, VDir.None, HDir.Left)
    throw new Error("Wasn't a box")
}

const findToMove = (from: Coords, vdir :VDir, hdir: HDir): Coords[] | null => {
    if (map.at(from) === '#') return null
    if (map.at(from) === '.') return []

    let shouldExpand = vdir !== VDir.None

    let front = [ from ]
    if (shouldExpand) {
        front.push(otherBoxTile(from))
    }

    let toMove: Coords[] = [ ...front  ]

    while (true) {
        let nextFront: Coords[] = []

        for(const tile of front) {
            const to = map.move(tile, vdir, hdir)

            if (map.at(to) === '#') return null
            if (map.at(to) === '.') continue

            nextFront.push(to)
            if (shouldExpand) nextFront.push(otherBoxTile(to))
        }

        if (nextFront.length === 0) break
        toMove.push(...nextFront)
        front = nextFront
    }

    return toMove
}

pos = map.find('@')!
map.set(pos, '.')

for(const inst of instrs) {
    const dir = instToDir[inst]

    const next = map.move(pos, dir[0], dir[1])

    const boxesToMove = findToMove(next, dir[0], dir[1])

    if (boxesToMove === null) continue

    for(const box of Arr.unique(boxesToMove, Arr.equals).reverse()) {
        map.set(map.move(box, dir[0], dir[1]), map.at(box))
        map.set(box, '.')
    }

    pos = next

}

console.log("Part2 answer is:", score())
console.timeEnd('Part2')