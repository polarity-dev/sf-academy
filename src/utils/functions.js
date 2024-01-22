"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.generateRandomDataFile = void 0;
// src/utils/functions.ts
const fs = __importStar(require("fs"));
/**
 * Generates a random integer between min and max, inclusive.
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * Generates a random data line in the format: priority + space + data string.
 */
const generateRandomDataLine = () => {
    const priority = getRandomInt(1, 5);
    const data = `data_${Math.random().toString(36).substr(2, 5)}`;
    return `${priority} ${data}`;
};
/**
 * Generates a file with N random data lines.
 */
const generateRandomDataFile = (filename, numberOfLines) => {
    let fileContent = '';
    for (let i = 0; i < numberOfLines; i++) {
        fileContent += generateRandomDataLine() + '\n';
    }
    fs.writeFileSync(filename, fileContent.trim());
};
exports.generateRandomDataFile = generateRandomDataFile;
/**
 * Delays execution for a given number of milliseconds.
 */
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.delay = delay;
