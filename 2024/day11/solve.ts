import { fileToChars, fileToInts, fileToLines, read } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const initStones = (await fileToInts(inputPath))[0]

// Part 1
console.time('Part1')

const blink = (n: number): number[] => {
    if (n === 0) {
        return [1]
    }

    if (N.digits(n) % 2 === 0) {
        const digits = n.toString().length
        const div = 10 ** (digits / 2)
        return [
            Math.floor(n / div),
            n % div
        ]
    }

    return [n * 2024]
}

const blinkMap = new Map<string, number>()

const blinkFor = (n: number, t: number): number => {

    const key = `${n}-${t}`
    if (blinkMap.has(key)) return blinkMap.get(key)!

    const nexts = blink(n)
    if (t === 1) return nexts.length
    const tot = nexts.reduce((tot, next) => tot + blinkFor(next, t - 1), 0)
    blinkMap.set(`${n}-${t}`, tot)
    return tot

}

let tot = initStones.reduce((tot, stone) => tot + blinkFor(stone, 25), 0)

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)

// Part 2
console.time('Part2')

tot = initStones.reduce((tot, stone) => tot + blinkFor(stone, 75), 0)

console.timeEnd('Part2')
console.log("Part2 answer is:", tot)
