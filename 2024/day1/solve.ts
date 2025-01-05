import { Counter } from "../../utils/numbers";
import { read, toLines, toWords } from "../../utils/parsing";

console.time('Parsing')

const inputPath = import.meta.dir + '/input.txt'
const lines = toLines(await read(inputPath))

const left = new Array<number>(lines.length)
const right = new Array<number>(lines.length)

lines.forEach((line, i) => {
    const words = toWords(line).map(w => parseInt(w))

    left[i] = words[0]
    right[i] = words[1]
    
})
console.timeEnd('Parsing')

console.time('Part1')

left.sort()
right.sort()
const tot = left.reduce((tot, leftVal, i) => tot += Math.abs(leftVal - right[i]), 0)

console.timeEnd('Part1')
console.log("Part1 answer is:", tot)


console.time('Part2')

const rightCount = new Counter

right.forEach(val => {
    rightCount.addTo(val)
})

const tot2 = left.reduce((tot, leftVal) => tot += leftVal * rightCount.at(leftVal), 0)

console.timeEnd('Part2')
console.log("Part2 answer is:", tot2)

