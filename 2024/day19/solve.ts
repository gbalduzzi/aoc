import { fileToLines } from "../../utils/parsing";
import { Trie } from "../../utils/trie";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const designs = await fileToLines(inputPath)

const towels = designs.shift()!.split(', ')
designs.shift()

// let's create a trie of the available towels
const trie = Trie.build(towels)
console.timeEnd('Parsing')

// Part 1
console.time('Part1')


let matchesMap = new Map<string, boolean>()

const designHasMatches = (design: string): boolean => {
    if (design.length === 0) return true

    if (matchesMap.has(design)) return matchesMap.get(design)!

    const matches = trie.matches(design)
    for(const match of matches) {
        const nextDesign = design.substring(match.length)
        const res = designHasMatches(nextDesign)
        matchesMap.set(nextDesign, res)
        if (res) return true
    }
    matchesMap.set(design, false)
    return false

}

const tot = designs.reduce((tot, design) => {
    matchesMap = new Map()
    return tot + (designHasMatches(design) ? 1 : 0)
}, 0)

console.log("Part1 answer is:", tot)
console.timeEnd('Part1')

// Part 2
console.time('Part2')

let matchesCount = new Map<string, number>()

const designMatchesCount = (design: string): number => {
    if (design.length === 0) return 1

    if (matchesCount.has(design)) return matchesCount.get(design)!

    let tot = 0

    const matches = trie.matches(design)
    for(const match of matches) {
        const nextDesign = design.substring(match.length)
        const res = designMatchesCount(nextDesign)
        matchesCount.set(nextDesign, res)
        tot += res
    }
    matchesCount.set(design, tot)
    return tot

}

const tot2 = designs.reduce((tot, design) => tot + designMatchesCount(design), 0)

console.log("Part2 answer is:", tot2)
console.timeEnd('Part2')

