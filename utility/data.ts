import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const randomNumber = function(min: number, max: number, negative: boolean = false): number {
    const multiply = negative ? (randomNumber(0, 1) ? 1 : -1) : 1;
    return Math.round((Math.random() * (max - min)) + min) * multiply;
};

const randomString = function(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLM NOPQRSTUVWXYZ abcdefghijklm nopqrstuvwxyz0123456789 ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(randomNumber(0, charactersLength));
    }
    return result;
}

const lines = randomNumber(1, 50);
const from = randomNumber(1, lines);
const to = randomNumber(from, lines);

const filePath = "./data/" + uuidv4() + ".txt";

fs.closeSync(fs.openSync(filePath, "w"));
const stream = fs.createWriteStream(filePath, {flags: 'a'});
// Write first line
stream.write(`${from} ${to}`);
// Write data lines
for (let i = 0; i < lines; i++) {
    const priority = randomNumber(1, 5);
    const value = randomNumber(0, 200, true);
    const message = randomString(randomNumber(20, 50));
    stream.write(`\n${priority} ${value} ${message}`);
}
stream.end();

console.log("Created file " + filePath);
