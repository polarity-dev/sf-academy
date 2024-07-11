const { argv } = require('process');
const { LoremIpsum } = require('lorem-ipsum');
const fs = require('fs');
const path = require('path');

const loremipsum = new LoremIpsum({});
const N = Number(argv[2] ?? 50);
const outFile = argv[3] ?? path.join(__dirname, "..", "data", "sample.txt");
let buffer = "";

loremipsum.generateWords(N).split(' ').forEach((word) => {
    buffer += loremipsum.generator.generateRandomInteger(1, 5) + " " + word + "\n";
});

fs.writeFile(outFile, buffer, (err) => {
    if (err) console.error(err);
});
