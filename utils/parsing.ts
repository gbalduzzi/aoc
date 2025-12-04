import { readFile } from "fs/promises";

export const read = async (path: string): Promise<string> =>
  (await readFile(path)).toString();

/*
 * Atomic operations
 */

export const toLines = (content: string) => content.split("\n");

export const toWords = (line: string) =>
  line.split(" ").filter((w) => w.length > 0);

export const toInts = (line: string) =>
  line
    .split(" ")
    .filter((w) => w.length > 0)
    .map((w) => parseInt(w, 10));

export const toDigits = (line: string) =>
  toChars(line).map((d) => parseInt(d, 10));

export const toChars = (line: string) => line.split("");

/*
 * All-in-one utils
 */

export const fileToLines = async (path: string): Promise<Array<string>> => {
  return toLines(await read(path));
};

export const fileToWords = async (
  path: string
): Promise<Array<Array<string>>> => {
  return toLines(await read(path)).map(toWords);
};

export const fileToInts = async (
  path: string
): Promise<Array<Array<number>>> => {
  return toLines(await read(path)).map(toInts);
};

export const fileToDigits = async (
  path: string
): Promise<Array<Array<number>>> => {
  return toLines(await read(path)).map(toDigits);
};

export const fileToChars = async (
  path: string
): Promise<Array<Array<string>>> => {
  return toLines(await read(path)).map(toChars);
};
