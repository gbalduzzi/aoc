import { fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const secrets = (await fileToLines(inputPath)).map(line => BigInt(line))


console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const mix = (a: bigint, b: bigint) => a ^ b
const prune = (a: bigint) => a % 16777216n

const evolve = (secret: bigint): bigint => {
   secret = prune(mix(secret * 64n, secret))
   secret = prune(mix(secret / 32n, secret))
   return prune(mix(secret * 2048n, secret))
}

let tot = secrets.reduce((tot, secret) => {
    for (let i = 0; i < 2000; i++) {
        secret = evolve(secret)
    }
    return tot + secret
}, 0n)



console.log("Part1 answer is:", tot)
console.timeEnd('Part1')

// Part 2
console.time('Part2')

const sequenceTotals = new Map<bigint, bigint>()

const sequenceHash = (a: bigint, b: bigint, c: bigint, d: bigint) => {
    return (d + 10n) + (c + 10n) * 100n + (b + 10n) * 10000n + (a + 10n) * 1000000n
}

for (let secret of secrets) {
    let a = 0n, b = 0n, c = 0n, d = 0n
    let prev = 0n

    const visited = new Set<bigint>()

    for (let i = 0; i < 2000; i++) {
        
        let price = secret % 10n

        a = b
        b = c
        c = d
        d = price - prev

        let hash = sequenceHash(a,b,c,d)

        if (!visited.has(hash) && i > 3) 
            sequenceTotals.set(hash, (sequenceTotals.get(hash) ?? 0n) + price)
        visited.add(hash)

        secret = evolve(secret)
        prev = price
    }
}

let max = 0n


for (const [h, v] of sequenceTotals.entries()) {
    if (v > max) max = v
}

console.log("Part2 answer is:", max)
console.timeEnd('Part2')

