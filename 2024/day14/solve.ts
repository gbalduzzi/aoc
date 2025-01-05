import { fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

type Bot = [px: number, py: number, vx: number, vy: number]

const bots: Bot[] = []

lines.forEach(line => {
    const [pos, vel] = line.split(' ')

    const [px, py] = pos.replace('p=', '').split(',').map(p => parseInt(p))
    const [vx, vy] = vel.replace('v=', '').split(',').map(v => parseInt(v))

    bots.push([px, py, vx, vy])
})

console.timeEnd('Parsing')

const predict = (bot: Bot, rows: number, cols: number, t: number): [number, number] => {

    let x = (bot[0] + bot[2] * t) % cols 
    let y = (bot[1] + bot[3] * t) % rows 

    if (x < 0) x = cols + x
    if (y < 0) y = rows + y

    return [x, y]
}

// Part 1
console.time('Part1')

let tl = 0, tr = 0, br = 0, bl = 0

let R = 103, C = 101
let midR = Math.floor(R / 2), midC = Math.floor(C / 2)

for(const bot of bots) {
    const [x, y] = predict(bot, R, C, 100)
    
    if (x < midC && y < midR) tl += 1
    if (x > midC && y < midR) tr += 1
    if (x > midC && y > midR) br += 1
    if (x < midC && y > midR) bl += 1

}


console.log("Part1 answer is:", tl * tr * br * bl)
console.timeEnd('Part1')

// Part 2
console.time('Part2')

const print = (bots: Bot[], rows: number, cols: number) => {
    const grid: string[][] = []
    for (let i = 0; i < cols; i++) {
        grid.push([] as string[])
        for (let j = 0; j < rows; j++) {
            grid[i].push(' ')
        }
    }

    for(const bot of bots) {
        grid[bot[0]][bot[1]] = '#'
    }


    for (let i = 0; i < cols; i++) {
        console.log(grid[i].join(''))
    }
}

const collapses = (bots: Bot[]): number => {
    const uniques = new Set<number>()

    for(const bot of bots) {
        uniques.add(bot[0] * 1.e6 + bot[1])
    }

    return bots.length - uniques.size
}

let i = 1
while (true) {
    for(const bot of bots) {
        const [x, y] = predict(bot, R, C, 1)
        
        bot[0] = x
        bot[1] = y
    }

    // Noticed with some trials that the pattern does not collapse
    if (collapses(bots) === 0) {
        print(bots, R, C)
        break
    }
    
    i++
}

console.log("Part2 answer is:", i)
console.timeEnd('Part2')