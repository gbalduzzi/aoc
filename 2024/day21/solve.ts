import { fileToLines } from "../../utils/parsing";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords, RIGHT } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

console.timeEnd('Parsing')

const numKeypad = new Matrix([
    [ '7', '8', '9'],
    [ '4', '5', '6'],
    [ '1', '2', '3'],
    [ '*', '0', 'A'],
])

const dirKeypad = new Matrix([
    [ '*', '^', 'A'],
    [ '<', 'v', '>'],
])


const buildMap = (keypad: Matrix<string>): Map<string, string[]> => {
    const dirMap = new Map<string, string[]>()

    const missing = keypad.find('*')!

    for (let i = 0; i < keypad.rows; i++) {
        for (let j = 0; j < keypad.cols; j++) {
            
            const from: Coords = [i, j]

            if (Arr.equals(from, missing)) continue
    
            for (let k = 0; k < keypad.rows; k++) {
                for (let w = 0; w < keypad.cols; w++) {
                
                    const to: Coords = [k, w]
                    if (Arr.equals(to, missing)) continue

                    const key = keypad.at(from) + keypad.at(to)
    
                    const hdir = w > j ? '>' : '<'
                    const vdir = k > i ? 'v' : '^'
    
                    const hFirst = hdir.repeat(Math.abs(w-j)) + vdir.repeat(Math.abs(k-i)) + 'A'
                    const vFirst = vdir.repeat(Math.abs(k-i)) + hdir.repeat(Math.abs(w-j)) + 'A'

                    // Understand if we must avoid the empty space
                    if(i === missing[0] && w === missing[1]) {
                        dirMap.set(key, [vFirst] )
                    } else if (j === missing[1] && k === missing[0]) {
                        dirMap.set(key, [hFirst] )
                    } else {
                        dirMap.set(key, Arr.unique([hFirst, vFirst]) )
                    }
                }
            }
        }
    }
    return dirMap
}


const numMap = buildMap(numKeypad)
const dirMap = buildMap(dirKeypad)

const expand = (sequence: string, map: Map<string, string[]>): Array<string[]> => {
    let from = 'A'
    let result = new Array<string[]>

    for (const item of sequence.split('')) {
        result.push(map.get(from + item)!)
        from = item
    }

    return result
}

const minPressesCache = new Map<string, number>()

const minPresses = (option: string, robots: number): number => {
    if (robots === 0) return option.length

    const cacheKey = option + robots

    if (!minPressesCache.has(cacheKey)) {
        let res = 0

        for (const nextOption of expand(option, dirMap)) {
            res += Math.min(...nextOption.map(nextOption => minPresses(nextOption, robots - 1)))
        }
    
        minPressesCache.set(cacheKey, res)
    }

    return minPressesCache.get(cacheKey)!
}


// Part 1
console.time('Part1')

let tot = 0

for (const line of lines) {
    const path = expand(line, numMap)

    const len = path.reduce((tot, pathOptions) => {
        return tot + Math.min(...pathOptions.map(opt => minPresses(opt, 2)))
    }, 0)

    tot += len * parseInt(line.replace('A', ''))

}

console.log("Part1 answer is:", tot)
console.timeEnd('Part1')

// Part 2
console.time('Part2')


tot = 0

for (const line of lines) {
    const path = expand(line, numMap)

    const len = path.reduce((tot, pathOptions) => {
        return tot + Math.min(...pathOptions.map(opt => minPresses(opt, 25)))
    }, 0)

    tot += len * parseInt(line.replace('A', ''))

}

console.log("Part2 answer is:", tot)
console.timeEnd('Part2')

