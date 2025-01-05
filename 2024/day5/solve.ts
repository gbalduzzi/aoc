import { middle, swap } from "../../utils/arrays";
import { read, toLines } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = toLines(await read(inputPath))

const rules = new Set<string>()

for (const line of lines) {
    if (line === '') break
    rules.add(line)
}

const updates = lines.filter((line) => !line.includes('|') && !(line === ''))
    .map((line) => line.split(','))

console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const invalids: string[][] = []
const tot = updates.reduce(
    (tot, update) => {
        for (let i = 0; i < update.length - 1; i++) {
            for (let j = i + 1; j < update.length; j++) {
                if (rules.has(`${update[j]}|${update[i]}`)) {
                    invalids.push(update)
                    return tot
                }
            }
        }

        return tot + parseInt(middle(update))
    },
    0
)

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)

// Part 2
console.time('Part2')

const tot2 = invalids.reduce(
    (tot, update) => {
        for (let i = 0; i < update.length - 1; i++) {
            for (let j = i + 1; j < update.length; j++) {
                if (rules.has(`${update[j]}|${update[i]}`)) {
                    swap(update, i, j)
                }
            }
        }

        return tot + parseInt(middle(update))
    },
    0
)

console.timeEnd('Part2')
console.log("Part2 answer is:", tot2)
