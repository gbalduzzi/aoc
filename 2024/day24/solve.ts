import { fileToLines } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const lines = await fileToLines(inputPath)

let i;

const initVars = new Map<string, number>
for (i = 0;; i++) {
    if (lines[i] === "") break
    const [name, val] = lines[i].split(": ")
    initVars.set(name, parseInt(val))
}

type Operation = {var1: string, op: 'AND' | 'XOR' | 'OR', var2: string, output: string}
const operations = new Map<string, Operation>()

for (i = i+1;i < lines.length; i++) {
    if (lines[i] === "") break


    const words = lines[i].replace('-> ', '').split(" ")

    const op: Operation = {
        var1: words[0],
        op: words[1] as 'AND' | 'XOR' | 'OR',
        var2: words[2],
        output: words[3]
    }

    operations.set(op.output, op)
}

console.timeEnd('Parsing')

// Part 1
console.time('Part1')

const fromBits = (vars: Map<string, number>, filter: 'x' | 'y' | 'z'): bigint => {
    let result = 0n
    for (const [name, value] of vars.entries()) {
        if (!name.startsWith(filter)) continue
        if (value === 0) continue
        let pos = BigInt(name.replace(filter, ''))

        result += 2n ** pos
    }
    return result
}

const execute = (vars: Map<string, number>): bigint => {

    let missing = operations.values().toArray()

    while (missing.length > 0) {
        let nextMissing: Operation[] = []
        for (const operation of missing) {
        
            const val1 = vars.get(operation.var1)
            const val2 = vars.get(operation.var2)
    
            if (val1 === undefined || val2 === undefined) {
                nextMissing.push(operation)
                continue
            }
        
            let res = 0
            if (operation.op === 'AND') res = val1 && val2
            if (operation.op === 'XOR') res = val1 ^ val2
            if (operation.op === 'OR') res = val1 || val2
    
            vars.set(operation.output, res)
        }

        if (Arr.equals(missing, nextMissing)) return -1n
        missing = nextMissing
    }


    return fromBits(vars, 'z')
}

const z = execute(new Map(initVars))

console.log("Part1 answer is:", z)
console.timeEnd('Part1')

// Part 2
console.time('Part2')


const swap = (var1: string, var2: string) => {
    const var1Op =  operations.get(var1)!
    const var2Op = operations.get(var2)!
    var1Op.output = var2
    var2Op.output = var1

    operations.set(var1, var2Op)
    operations.set(var2, var1Op)
}

// Each bit has the following pattern of operations:

// Zn -> An XOR Bn
// Bn -> Xn XOR Yn
// An -> Cn OR  Dn
// Dn -> Xn-1 AND Yn-1
// Cn -> An-1 AND Bn-1

// Only difference is first bit: Z0 -> X0 XOR X0
// second bit, straightforward: Z1 -> A1 XOR B1
// where A1 = y01 XOR X01 and  B1 -> A0 AND 
// and last bit: Z45 -> A45 (no final XOR)

// Let's check where the pattern does not hold

const searchFor = (var1: string, var2: string, op: string) => {
    for (const [, operation] of operations) {
        if (checkOperation(operation, var1, var2, op)) return operation
    }

    return null
}

const isVarOf  = (operation: Operation, varName: string) => {
    return varName === operation.var1 || varName == operation.var2
}

const checkOperation = (operation: Operation, var1: string, var2: string, op: string): boolean => {
    if (operation.op !== op) return false

    if (![operation.var1, operation.var2].includes(var1)) return false
    if (![operation.var1, operation.var2].includes(var2)) return false

    return true
}

const wrongs = new Set<string>()


const toSwap = (var1: string, var2: string) => {
    wrongs.add(var1)
    wrongs.add(var2)
    swap(var1, var2)
}

// First two bits are correct, already checked

for (let i = 2; i < 45; i++) {

    const prevX = `x${(i-1).toString().padStart(2, '0')}`
    const prevY = `y${(i-1).toString().padStart(2, '0')}`
    const prevZ = `z${(i-1).toString().padStart(2, '0')}`
    const prevXor = operations.get(prevZ)! 

    const xVar = `x${i.toString().padStart(2, '0')}`
    const yVar = `y${i.toString().padStart(2, '0')}`
    const zVar = `z${i.toString().padStart(2, '0')}`

    const zXor = operations.get(zVar)!

    const B = searchFor(xVar, yVar, 'XOR')!

    const D = searchFor(prevX, prevY, 'AND')!
    const C = searchFor(prevXor.var1, prevXor.var2, 'AND')!

    const A = searchFor(C.output, D.output, 'OR')

    // We assume a maximum of 1 swap required to solve each bit
    // Otherwise we are doomed :)

    if (zXor.op !== 'XOR') {
        const actualXor = searchFor(A!.output, B.output, 'XOR')!
        toSwap(zXor.output, actualXor.output)

        continue
    }
    
    if (!isVarOf(zXor, B.output)) {
        if (isVarOf(zXor, A!.output)) {
            // Ok, A output is correct, so B output is wrong
            const actualB = zXor.var1 === A!.output ? zXor.var2 : zXor.var1
            toSwap(actualB, B.output)
        
        } else {
            const actualXor = searchFor(A!.output, B.output, 'XOR')!
            toSwap(zXor.output, actualXor.output)

        }

        continue
    }

    // Ok, B and Z are correct, so we know what A should be
    const AVar = zXor.var1 === B.output ? zXor.var2 : zXor.var1

    if (A?.output === AVar) continue

    const actualA = operations.get(AVar)!

    if (A === null) {
        if (isVarOf(actualA, C.output)) {
            // ok, D output is wrong
            const actualD = actualA.var1 === C.output ? actualA.var2 : actualA.var1
            toSwap(actualD, D.output)
        } else {
            // ok, C output is wrong
            const actualC = actualA.var1 === D.output ? actualA.var2 : actualA.var1
            toSwap(actualC, C.output)
        }
    } else {
        toSwap(actualA.output, A.output)
    }
}

console.log("Part2 answer is:", wrongs.values().toArray().sort().join(','))
console.timeEnd('Part2')


