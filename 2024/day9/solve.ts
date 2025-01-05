import { read } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const input = await read(inputPath)

const digits = input.split('').map((d) => parseInt(d))

const files = digits.filter((d, i) => i % 2 === 0)
const frees = digits.filter((d, i) => i % 2 === 1)

console.timeEnd('Parsing')

const calcChecksum = (final: [n: number, id: number][]) => {
    const [, tot] = final.reduce(
        ([i, tot], f) => {
            return [i + f[0],  tot + f[1] * (i + i + f[0] - 1) * (f[0] / 2) ] // Gauss sum
        },
        [0, 0]
    )
    return tot
}

// Part 1
console.time('Part1')

let fileBlocks = [...files]
let freeBlocks = [...frees]

let disk: [n: number, id: number][] = []

let i = fileBlocks.length - 1;
let j = 0
disk.push([fileBlocks[j], j])

while (j < i) {
    const moved = Math.min(freeBlocks[j], fileBlocks[i])
    disk.push([moved, i])
    freeBlocks[j] -= moved
    fileBlocks[i] -= moved

    if (freeBlocks[j] === 0) {
        j++
        disk.push([fileBlocks[j], j])
    }

    if (fileBlocks[i] === 0) {
        i--
    }
}

console.timeEnd('Part1')
console.log("Part1 answer is:", calcChecksum(disk))

// Part 2
console.time('Part2')

// Reset data

fileBlocks = [...files]
freeBlocks = [...frees]

disk = []

const movedTo: [n: number, id: number, pos: number][] = []
const movedIds = new Set<number>()

i = fileBlocks.length - 1;
j = 0
// Find which files to move
for(let i = fileBlocks.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
        if (freeBlocks[j] >= fileBlocks[i]) {
            freeBlocks[j] -= fileBlocks[i]
            movedTo.push([fileBlocks[i], i, j])
            movedIds.add(i)
            break
        }
    }
}
// Recreate final disk structure
for(let i = 0; i < fileBlocks.length; i++) {
    if (movedIds.has(i)) {
        disk.push([fileBlocks[i], 0]) // Fake empty space
    } else {
        disk.push([fileBlocks[i], i])
    }

    movedTo.filter(m => m[2] === i)
        .forEach((m) => {
            disk.push([m[0], m[1]])
        })
    
    if (i < freeBlocks.length && freeBlocks[i] > 0) {
        disk.push([freeBlocks[i], 0]) // Remaining empty space
    }
}

console.timeEnd('Part2')
console.log("Part2 answer is:", calcChecksum(disk))
