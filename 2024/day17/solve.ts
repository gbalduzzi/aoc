import { fileToLines } from "../../utils/parsing";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)


console.timeEnd('Parsing')

let A: number = 0
let B: number = 0
let C: number = 0

let instPointer = 0
let output: number[] = []

const combo = (op: number): number => {
    if (op >= 0 && op <= 3) return op
    if (op === 4) return A
    if (op === 5) return B
    if (op === 6) return C

    throw new Error(`Combo with ${op}`)
}

const adv = (op: number) => A = Math.floor(A / (2 ** combo(op)))
const bxl = (op: number) => B = B ^ op 
const bst = (op: number) => B = combo(op) % 8
const jnz = (op: number) => {
    if (A === 0) return
    if (instPointer !== op) instPointer = op - 2
}
const bxc = (op: number) => B = B ^ C 
const out = (op: number) => output.push(combo(op) % 8)
const bdv = (op: number) => B = Math.floor(A / (2 ** combo(op)))
const cdv = (op: number) => C = Math.floor(A / (2 ** combo(op)))

const opcodes = [ adv, bxl, bst, jnz, bxc, out, bdv, cdv ]

const reset = (a: number, b: number, c: number) => {
    output = []
    instPointer = 0
    A = a, B = b, C = c
}

const run = (a: number, b: number, c: number, instrs: number[]) => {
    reset(a, b, c)

    while (instPointer < instrs.length) {
        const opcode = instrs[instPointer]
        const op = instrs[instPointer + 1]
        opcodes[opcode](op)

        instPointer += 2
    }
}

let inputA = parseInt(lines[0].replace('Register A: ', ''))
const inputB = parseInt(lines[1].replace('Register B: ', ''))
const inputC = parseInt(lines[2].replace('Register C: ', ''))

let inputProgram = lines[4].replace('Program: ', '').split(',').map(i => parseInt(i))

// Part 1
console.time('Part1')

run(inputA, inputB, inputC, inputProgram)

console.log("Part1 answer is:", output.join(','))
console.timeEnd('Part1')

// Part 2
console.time('Part2')

// Given A, check what the output of next iteration would be 
const outputFor = (a: bigint): bigint | null => {
    let b = (a % 8n) ^ 2n
    //if (b === 7) return null
    let c = a / (2n ** b)

    return (b ^ c ^ 7n) % 8n
}

// By reverse engineering the program, each iteration divides a by 8 and loops until a becomes zero.
// That means that the last iteration will have a between 0 and 7. We can go over the desired output in reverse
// and determine at each step what 3 bit add to a
const findFrom = (a: bigint, targetI: number, reverseProgram: number[]): bigint | null => {

    if (targetI >= reverseProgram.length) {
        return a
    }

    const target = BigInt(reverseProgram[targetI])

    a = a * (2n ** 3n)

    for (let i = 0n; i < 8n; i++) {
        if (outputFor(a + i) === target) {
            const res = findFrom(a + i, targetI+1, reverseProgram)
            if (res !== null) return res
        }
    }

    return null
}

const res = findFrom(0n, 0, inputProgram.reverse())

console.log("Part2 answer is:", res)
console.timeEnd('Part2')

