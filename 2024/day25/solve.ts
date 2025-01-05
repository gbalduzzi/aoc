import { read } from "../../utils/parsing";

// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const file = await read(inputPath)

type Scheme = [number, number, number, number, number]

const keys: Scheme[] = []
const locks: Scheme[] = []

file.split("\n\n").forEach(grid => {
    const lines = grid.split("\n")

    const isLock = lines[0] === '#####'

    const scheme: Scheme = [-1,-1,-1,-1,-1]
    lines.forEach(line => line.split('')
        .forEach((l, i) => {
            if (l === '#') scheme[i] += 1
        })
    )
    isLock ? locks.push(scheme) : keys.push(scheme)
})


console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const fits = (lock: Scheme, key: Scheme) => !lock.some((l, i) => (l + key[i]) >= 6)

let tot = 0
for (const lock of locks) {
    for (const key of keys) {
        if (fits(lock, key)) tot++
    }
}

console.log("Part1 answer is:", tot)
console.timeEnd('Part1')


