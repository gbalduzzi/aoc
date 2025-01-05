
import { Coords, DIRS, HDir, Matrix, VDir } from "../../utils/matrix";
import { fileToChars, read } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const data = await fileToChars(inputPath)
const grid = new Matrix(data)

console.timeEnd('Parsing')


// Part 1
console.time('Part1')

const xmasFromPosition = (i: number, j: number) => {
    const pos = [i, j] as Coords
    const target = [ 'M', 'A', 'S']

    let tot = 0
    for(const dir of DIRS) {
        for (let k = 0; k < 3; k++) {
            const coords = grid.move(pos, dir[0], dir[1], k+1)

            if (!grid.exists(coords)) break
            if (grid.at(coords) !== target[k]) break

            if (k == 2) tot += 1
        }
    }

    return tot
}

let tot = 0
for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
        if (grid.at([i, j]) !== 'X') continue

        tot += xmasFromPosition(i, j)
    }
}

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)


// Part 2
console.time('Part2')

const crossMasFromPosition = (i: number, j: number) => {
    const pos = [i, j] as Coords

    const diags: Coords[] = [
        grid.move(pos, VDir.Up, HDir.Left),
        grid.move(pos, VDir.Up, HDir.Right),
        grid.move(pos, VDir.Down, HDir.Right),
        grid.move(pos, VDir.Down, HDir.Left),
    ]

    for(const diag of diags) {
        if (!grid.exists(diag)) return 0
    }

    // OK, all coords are valid now
    const diag1 = grid.at(diags[0]) + grid.at(diags[2])
    const diag2 = grid.at(diags[1]) + grid.at(diags[3])

    const valids = ['MS', 'SM']
    if (valids.includes(diag1) && valids.includes(diag2)) {
        return 1
    }

    return 0
}

let tot2 = 0
for (const [i, j, l] of grid.loop()) {
    if (l !== 'A') continue

    tot2 += crossMasFromPosition(i, j)
}

console.timeEnd('Part2')
console.log("Part2 answer is:", tot2)

// Found on reddit by PangolinNo7928: https://www.reddit.com/r/adventofcode/comments/1h689qf/comment/m0cb552/
// Wanted to test it out, it's awesome
console.time('Part2 Regex')
const tot3 = (await read(inputPath)).match(/(?=(M|S).(M|S).{139}A.{139}(?!\2)(M|S).(?!\1)(M|S))/gsd)!.length
console.timeEnd('Part2 Regex')
console.log("Part2 regexp answer is:", tot3)
