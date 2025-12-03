export const isBetween = (min: number, val: number, max: number) => {
  return val >= min && val <= max;
};

export const inBetween = (min: number, val: number, max: number): number => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
};

export const midIndex = (len: number) => Math.floor(len / 2);

// least common multiple
export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

// greatest common denominator
export const gcd = (a: number, b: number): number => {
  let i = Math.ceil(Math.min(a, b) / 2);

  for (; ; i--) {
    if (a % i === 0 && b % i === 0) {
      return i;
    }
  }
};

export const primesUpTo = (n: number): number[] => {
  let nums: number[] = new Array(n - 1);

  for (let i = 2; i <= n; i++) {
    nums[i - 2] = i;
  }

  for (let i = 0; i <= Math.sqrt(n); i++) {
    if (nums[i] === 0) continue;

    let target = nums[i] * 2;

    while (target <= n) {
      nums[target - 2] = 0;
      target += nums[i];
    }
  }

  return nums.filter((p) => p !== 0);
};

export const concat = (a: number, b: number): number => {
  return a * Math.pow(10, digits(b)) + b;
};

export const digits = (a: number): number => {
  return Math.floor(Math.log10(a)) + 1;
};

// Util class to store counting for unique keys. Provides a default of 0 for missing keys
export class Counter<T extends string | number = string | number> {
  map: Map<T, number> = new Map();

  public at(key: T, def: number = 0): number {
    return this.has(key) ? this.map.get(key)! : def;
  }

  public addTo(key: T, step: number = 1) {
    this.map.set(key, this.at(key) + step);
  }

  public has(key: T): boolean {
    return this.map.has(key);
  }

  public set(key: T, c: number) {
    this.map.set(key, c);
  }

  public del(key: T) {
    this.map.delete(key);
  }

  public max(): [key: T, c: number] {
    let max;
    for (const [key, count] of this.map.entries()) {
      if (max === undefined || max[1] < count) {
        max = [key, count];
      }
    }
    return max;
  }
}
