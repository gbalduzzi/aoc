import { concat } from "../../utils/numbers";
import { fileToLines, toWords } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

const eqs: [x: number, vals: number[] ][] = []

for (const line of lines) {
    const [x, ...vals] = toWords(line)
    x.replace(':', '')
    eqs.push([parseInt(x), vals.map(v => parseInt(v))])
}
console.timeEnd('Parsing')

// Part 1
console.time('Part1')

let tot = 0
for (const [x, vals] of eqs) {

    let results: number[] = [ vals[0] ]

    for (let i = 1; i < vals.length; i++) {
        let nextResults: number[] = []

        for(const res of results) {
            if (res + vals[i] <= x) nextResults.push(res + vals[i])
            if (res * vals[i] <= x) nextResults.push(res * vals[i])
        }
        results = nextResults
    }

    if (results.some((r) => r === x)) tot += x
}

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)

// Part 2
console.time('Part2')

tot = 0
for (const [x, vals] of eqs) {

    let results: number[] = [ vals[0] ]

    for (let i = 1; i < vals.length; i++) {
        let nextResults: number[] = []

        for(const res of results) {
            if (res + vals[i] <= x) nextResults.push(res + vals[i])
            if (res * vals[i] <= x) nextResults.push(res * vals[i])
            const conc = concat(res, vals[i])
            if (conc <= x) nextResults.push(conc)
        }
        results = nextResults
    }

    if (results.some((r) => r === x)) tot += x
}


console.timeEnd('Part2')
console.log("Part2 answer is:", tot)
