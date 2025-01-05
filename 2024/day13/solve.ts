import { fileToChars, fileToInts, fileToLines, read } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords, BASIC_DIRS, VDir, HDir } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

type Btn = [x: number, y: number]
type Machine = {a: Btn, b: Btn, prize: Btn}

let m: Machine = {a: [0,0], b: [0,0], prize: [0,0]}

let machines: Machine[] = [ m ]

for (const line of lines) {

    if (line.trim() === '') {
        m = {a: [0,0], b: [0,0], prize: [0,0]}
        machines.push(m)
        continue
    }

    const [type, content] = line.split(': ')

    const btn = content.split(', ')
        .map(c => c.replace('X=', '').replace('Y=', '').replace('X+', '').replace('Y+', ''))
        .map(c => parseInt(c)) as Btn

    if (type === 'Button A') m.a = btn
    if (type === 'Button B') m.b = btn
    if (type === 'Prize') m.prize = btn
}

console.timeEnd('Parsing')

/*
 * Just math, With N = a presses and M = b presses, starting from the system:
 * Px = N * Ax + M * Bx =>  N = (Px - M * Bx) / Ax 
 * Py = N * Ay + M * By =>  N => (Py - M * By) / Ay
 * 
 * You compare those two, multiply by the dividends and obtain:
 * Px * Ay - M * Bx * Ay = Py * Ax - M * By * Ax
 * So M = (Py * Ax - PxAy) / (ByAx - BxAy)
 * You can do the same for N. We can only keep the results with an integer solution
 * 
 * NB it explodes in case of 0, but there isn't any in the input
 */

const tokens = (m: Machine, offset: number = 0): number => {
    const px = m.prize[0]+offset
    const py = m.prize[1]+offset

    let numA = (px * m.b[1]) - (py * m.b[0])        // Px * By - Py * Bx
    let numB = (py * m.a[0]) - (px * m.a[1])        // Py * Ax - Px * Ay
    let div = (m.b[1] * m.a[0]) - (m.b[0] * m.a[1]) // By * Ax - Bx * Ay

    if (numB % div !== 0) return 0
    if (numA % div !== 0) return 0

    return (numA / div) * 3 + numB / div
}

// Part 1
console.time('Part1')

let tot = machines.reduce((tot, m) => tot + tokens(m), 0)

console.log("Part1 answer is:", tot)
console.timeEnd('Part1')

// Part 2
console.time('Part2')

tot = machines.reduce((tot, m) => tot + tokens(m, 1e13), 0)

console.log("Part2 answer is:", tot)
console.timeEnd('Part2')