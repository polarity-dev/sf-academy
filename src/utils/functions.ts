// src/utils/functions.ts
import * as fs from 'fs';

/**
 * Generates a random integer between min and max, inclusive.
 */
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random data line in the format: priority + space + data string.
 */
const generateRandomDataLine = (): string => {
  const priority = getRandomInt(1, 5);
  const data = `data_${Math.random().toString(36).substr(2, 5)}`;
  return `${priority} ${data}`;
};

/**
 * Generates a file with N random data lines.
 */
export const generateRandomDataFile = (filename: string, numberOfLines: number): void => {
  let fileContent = '';
  for (let i = 0; i < numberOfLines; i++) {
    fileContent += generateRandomDataLine() + '\n';
  }
  fs.writeFileSync(filename, fileContent.trim());
};

/**
 * Delays execution for a given number of milliseconds.
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};