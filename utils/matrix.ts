import { isBetween } from "./numbers"

export type Coords = [i: number, j: number ]
export type DIR = [VDir, HDir]

export enum VDir {
    None = 0, Up = -1, Down = 1
}

export enum HDir {
    None = 0, Left = -1, Right = 1
}

export const UP_LEFT: DIR = [ VDir.Up, HDir.Left ]
export const UP: DIR = [ VDir.Up, HDir.None ]
export const UP_RIGHT: DIR = [ VDir.Up, HDir.Right ]
export const RIGHT: DIR =[ VDir.None, HDir.Right ]
export const DOWN_RIGHT: DIR =[ VDir.Down, HDir.Right ]
export const DOWN: DIR = [ VDir.Down, HDir.None ]
export const DOWN_LEFT: DIR = [ VDir.Down, HDir.Left ]
export const LEFT: DIR = [ VDir.None, HDir.Left ]


export const DIRS: DIR[] = [ 
    UP_LEFT, UP, UP_RIGHT, RIGHT, DOWN_RIGHT, DOWN, DOWN_LEFT, LEFT
]


export const BASIC_DIRS: DIR[] = [ 
    UP, RIGHT, DOWN, LEFT
]

export const turn = (from: DIR, clockwise: boolean = true): DIR => {
    if (from === UP) return clockwise ? RIGHT : LEFT
    if (from === RIGHT) return clockwise ? DOWN : UP
    if (from === DOWN) return clockwise ? LEFT : RIGHT
    if (from === LEFT) return clockwise ? UP : DOWN
    return from
}

export class Matrix<T>{

    constructor(grid: T[][]) {
        this.grid = grid
    }

    grid: T[][]

    get rows() {
        return this.grid.length
    }

    get cols() {
        return this.grid[0].length
    }

    public static create = <T>(r: number, c: number, v: T) => {
        const data: T[][] = new Array(r)
        for (let i = 0; i < r; i++) {
            data[i] = new Array(v)
            for (let j = 0; j < c; j++) {
                data[i][j] = v
            }
        }

        return new Matrix(data)
    }

    public move = (c: Coords, vDir: VDir, hDir: HDir, step: number = 1): Coords => {
        return [
            c[0] + step * vDir,
            c[1] + step * hDir,
        ]
    }

    public set = (c: Coords, v: T): void => {
        this.grid[c[0]][c[1]] = v
    }

    public at = (c: Coords): T => {
        return this.grid[c[0]][c[1]]
    }

    public exists = (c: Coords): boolean => {
        return isBetween(0, c[0], this.rows - 1) && isBetween(0, c[1], this.cols - 1)
    }

    public find = (k: T): Coords | null => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] === k) {
                    return [i, j]
                }
            } 
        }
        return null
    }

    public findAll = (k: T | T[]): Coords[] => {
        if (!Array.isArray(k)) {
            k = [ k ]
        }

        const res: Coords[] = []
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (k.includes(this.at([i, j]))) {
                    res.push([i,j])
                }
            } 
        }
        return res
    }

    public around = (c: Coords): Coords[] => {
        const res: Coords[] = []
        const top = this.move(c, VDir.Up, HDir.None)
        if (this.exists(top)) res.push(top)

        const bottom = this.move(c, VDir.Down, HDir.None)
        if (this.exists(bottom)) res.push(bottom)

        const right = this.move(c, VDir.None, HDir.Right)
        if (this.exists(right)) res.push(right)

        const left = this.move(c, VDir.None, HDir.Left)
        if (this.exists(left)) res.push(left)

        return res
    }

    // Not great performance, nice to know but avoid
    public * loop(): Generator<[number, number, T]> {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                yield [i, j, this.at([i, j])]
            } 
        }
    }

    public transpose() {
        const trans: T[][] = new Array(this.cols)
        for (let j = 0; j < this.cols; j++) {
            trans[j] = new Array(this.rows)
            for (let i = 0; i < this.rows; i++) {
                trans[j][i] = this.at([i, j])
            } 
        }
        this.grid = trans
        return this
    }

    public printTable() {
        console.table(this.grid)
    }

    public print() {
        for (let i = 0; i < this.rows; i++) {
            console.log(this.grid[i].join(''))
        }
    }
}