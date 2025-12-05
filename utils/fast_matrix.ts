export type Dir = -1 | 0 | 1;
export type FullDir = [Dir, Dir];

export const UP_LEFT: FullDir = [-1, -1];
export const UP: FullDir = [-1, 0];
export const UP_RIGHT: FullDir = [-1, 1];
export const RIGHT: FullDir = [0, 1];
export const DOWN_RIGHT: FullDir = [1, 1];
export const DOWN: FullDir = [1, 0];
export const DOWN_LEFT: FullDir = [1, -1];
export const LEFT: FullDir = [0, -1];

export const BASE_DIRS = [UP, RIGHT, DOWN, LEFT];
export const DIAGONALS = [UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT];

export const ALL_DIRS = [...BASE_DIRS, ...DIAGONALS];

export class Matrix<T> {
  constructor(data: T[], cols: number) {
    this.data = data;
    this.rows = data.length / cols;
    this.cols = cols;
  }

  static fromGrid<T>(data: T[][]): Matrix<T> {
    return new Matrix(data.flat(), data[0].length);
  }

  static create<T>(rows: number, cols: number, v: T): Matrix<T> {
    return new Matrix(new Array<T>(rows * cols).fill(v), cols);
  }

  data: T[];
  rows: number;
  cols: number;

  /*
   * Basics matrix management functions
   */

  public idx = (r: number, c: number): number => {
    return r * this.cols + c;
  };

  public rowFromIdx = (idx: number): number => {
    return Math.floor(idx / this.cols);
  };

  public colFromIdx = (idx: number): number => {
    return idx % this.cols;
  };

  public at = (r: number, c: number): T => this.atIdx(this.idx(r, c));

  public atIdx = (idx: number): T => this.data[idx];

  public set = (r: number, c: number, v: T) => this.setIdx(this.idx(r, c), v);

  public setIdx = (idx: number, v: T) => (this.data[idx] = v);

  /*
   * Complex utilities
   */

  /**
   * Given a starting idx and a dir, returns the corresponding new idx, if available
   */
  public move = (idx: number, dir: FullDir): number | null => {
    let r = this.rowFromIdx(idx) + dir[0];
    let c = this.colFromIdx(idx) + dir[1];

    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) {
      return null;
    }

    return this.idx(r, c);
  };

  public around = (r: number, c: number): T[] => {
    let minRow = Math.max(0, r - 1);
    let maxRow = Math.min(this.rows - 1, r + 1);

    let minCol = Math.max(0, c - 1);
    let maxCol = Math.min(this.cols - 1, c + 1);

    let res = [];

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        if (i === r && j === c) continue;
        res.push(this.at(i, j));
      }
    }

    return res;
  };

  public idxsAround = (idx: number): number[] => {
    let r = this.rowFromIdx(idx);
    let c = this.colFromIdx(idx);

    let minRow = Math.max(0, r - 1);
    let maxRow = Math.min(this.rows - 1, r + 1);

    let minCol = Math.max(0, c - 1);
    let maxCol = Math.min(this.cols - 1, c + 1);

    let res = [];

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        if (i === r && j === c) continue;
        res.push(this.idx(i, j));
      }
    }

    return res;
  };
}
