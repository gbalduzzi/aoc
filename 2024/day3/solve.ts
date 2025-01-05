import { read } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dir + '/input.txt'
const text = await read(inputPath)

console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g
const tot = text.matchAll(mulRegex).reduce(
    (tot, match) => tot + parseInt(match[1]) * parseInt(match[2]),
    0
)

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)

// Part 2
console.time('Part2')

const mulConditionalsRegex = /mul\((\d{1,3}), (\d{1,3})\)|do\(\)|don\'t\(\)/g
const [ tot2 ] = text.matchAll(mulConditionalsRegex).reduce(
    ([tot, enabled], match) => {
        if (match[0] === 'do()') return [tot, true]
        if (match[0] === "don't()") return [tot, false]
        if (!enabled) return [tot, enabled ] 
        
        return [ tot + parseInt(match[1]) * parseInt(match[2]), enabled ]
    },
    [0, true] as [number, boolean]
)

console.timeEnd('Part2')
console.log("Part2 answer is:", tot2)
