import { midIndex } from "./numbers"

export const middle = <T>(data: T[]): T => {
    return data[midIndex(data.length)]
}

export const chunk = <T>(data: T[], size: number): T[][] => {
    const n = Math.ceil(data.length / size)

    return [...Array(n)].map((_, i) => data.slice(i * size, (i+1) * size))
}

export const swap = <T>(data: T[], i: number, j: number): void => {
    const t = data[i]
    data[i] = data[j]
    data[j] = t
}

export const unique = <T>(data: T[], cmp: (a: T, b: T) => boolean = (a,b) => a === b): T[] => {
    const uniq: T[] = []
    data.forEach(item => {
        if (!uniq.some(u => cmp(u, item))) uniq.push(item)
    })
    return uniq
}

export const equals = <T>(a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false
    for(let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}

export const sum = (data: number[]): number => data.reduce((a, d) => a+d,0)

