import { fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

const network = new Map<string, Set<string>>()

for (const line of lines) {
    const [c1, c2] = line.split('-')

    if (!network.has(c1)) network.set(c1, new Set())
    network.get(c1)!.add(c2)

    if (!network.has(c2)) network.set(c2, new Set())
    network.get(c2)!.add(c1)
}

console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const found = new Set()

for (const [comp, linked] of network.entries()) {
    if (!comp.startsWith('t')) continue

    const links = linked.values().toArray()

    for (let i = 0; i < links.length - 1; i++ ) {
        for (let j = i + 1; j < links.length; j++) {

            if (network.get(links[i])!.has(links[j])) {
                found.add( [ comp, links[i], links[j] ].sort().join() )
            }
        }
    }
}


console.log("Part1 answer is:", found.size)
console.timeEnd('Part1')

// Part 2
console.time('Part2')

let best: string[] = []

for (const [comp, linked] of network.entries()) {
    let lan = new Set([comp])
    for (const other of linked.values()) {
        const otherLinks = network.get(other)!
        let inLan = true
        for (const lanNode of lan.values()) {
            if (!otherLinks.has(lanNode)) {
                inLan = false
                break
            }
        }
        if (inLan) lan.add(other)
    }

    if (lan.size > best.length) best = lan.values().toArray()
}

console.log("Part2 answer is:", best.sort().join())
console.timeEnd('Part2')

