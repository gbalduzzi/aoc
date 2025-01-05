import { fileToChars, fileToInts, fileToLines, read } from "../../utils/parsing";
import * as N from "../../utils/numbers";
import * as Arr from "../../utils/arrays";
import { Matrix, Coords, BASIC_DIRS, VDir, HDir } from "../../utils/matrix";


// Parsing
console.time('Parsing')

const inputPath = import.meta.dirname + '/input.txt'
const data = await fileToChars(inputPath)
const garden = new Matrix(data)


type Area = Set<string>

console.timeEnd('Parsing')


// Part 1
console.time('Part1')

const areas: Area[] = []

const findArea = (from: Coords): Area  => {
    const area = new Set( [ from.join('-') ] )
    const c = garden.at(from)

    let toCheck: Coords[] = [ from ]

    while (toCheck.length > 0) {
        const nextToCheck: Coords[] = [ ]
        for (const curr of toCheck) {
            for (const [vdir, hdir] of BASIC_DIRS ) {
                const check = garden.move(curr, vdir, hdir)
                if (!garden.exists(check)) continue
    
                if (garden.at(check) === c) {
                    area.add(check.join('-'))
                    nextToCheck.push(check)
                    garden.set(check, '.')
                }
            }
        }
       

        toCheck = nextToCheck
    }

    return area
}

for (let i = 0; i < garden.rows; i++) {
    for (let j = 0; j < garden.cols; j++) {
        if (garden.at([i, j]) === '.') continue
        areas.push(findArea([i, j]))
    }
}

const areaPerim = (area: Area): number =>  {
    let perim = 0
    for (const p of area) {
        const pos: Coords = p.split('-').map(c => parseInt(c)) as Coords

        for (const [vdir, hdir] of BASIC_DIRS ) {
            const check = garden.move(pos, vdir, hdir)
            if (!area.has(check.join('-'))) perim += 1
        
        }
    }

    return perim
}

console.log("Part1 answer is:", areas.reduce((tot, area) => tot + areaPerim(area) * area.size, 0))
console.timeEnd('Part1')

// Part 2
console.time('Part2')

const DIRS: Record<string, [VDir, HDir]> = {
    up: [ VDir.Up, HDir.None ],
    right: [ VDir.None, HDir.Right ],
    down: [ VDir.Down, HDir.None ],
    left: [ VDir.None, HDir.Left ]
}

const nextDir = (dir: [VDir, HDir]): [VDir, HDir] => {
    if (dir === DIRS.up) return DIRS.right
    if (dir === DIRS.right) return DIRS.down
    if (dir === DIRS.down) return DIRS.left
    if (dir === DIRS.left) return DIRS.up
    return dir
}

const prevDir = (dir: [VDir, HDir]): [VDir, HDir] => {
    if (dir === DIRS.up) return DIRS.left
    if (dir === DIRS.right) return DIRS.up
    if (dir === DIRS.down) return DIRS.right
    if (dir === DIRS.left) return DIRS.down
    return dir
}

const areaSides = (area: Area): number =>  {
    let sides = 0
    let sidesRef = new Set()

    for (const p of area) {
        const pos: Coords = p.split('-').map(c => parseInt(c)) as Coords

        for (const dir of Object.values(DIRS) ) {
            const check = garden.move(pos, dir[0], dir[1])
            if (area.has(check.join('-'))) continue
         
            // Check if prev and next dirs already registered the same side
            const prev = garden.move(check, ...prevDir(dir))
            const next = garden.move(check, ...nextDir(dir))

            if (!sidesRef.has([...prev, ...dir].join('-')) && !sidesRef.has([...next, ...dir].join('-'))) {
                sides += 1
            }

            sidesRef.add([...check, ...dir].join('-'))
        
        }
    }

    return sides
}

console.log("Part2 answer is:", areas.reduce((tot, area) => tot + areaSides(area) * area.size, 0))
console.timeEnd('Part2')

