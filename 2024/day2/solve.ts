import { isBetween } from "../../utils/numbers";
import { fileToInts } from "../../utils/parsing";

console.time('Parsing')

const inputPath = import.meta.dir + '/input.txt'
const reports = await fileToInts(inputPath)

console.timeEnd('Parsing')

const isSafe = (levels: number[]) => {
    const isIncreasing = levels[1] > levels[0]

    const min = isIncreasing ? 1 : -3
    const max = isIncreasing ? 3 : -1

    let prev = levels[0]

    for (let i = 1; i < levels.length; i++) {
        if (!isBetween(min, levels[i] - prev, max)) {
            return false
        }
        prev = levels[i]
    }

    return true
}

console.time('Part1')

const tot = reports.reduce(
    (tot, levels) => tot += isSafe(levels) ? 1 : 0, 
    0
)

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)

console.time('Part2')

const tot2 = reports.reduce(
    (tot, reportLevels) => {
        for(let i = 0; i < reportLevels.length; i++) {
            const levels = reportLevels.filter((_, j) => i !== j)
            if (isSafe(levels)) {
                return tot + 1
            }
        }
        return tot
    },
    0
)

console.timeEnd('Part2')
console.log("Part2 answer is:", tot2)

