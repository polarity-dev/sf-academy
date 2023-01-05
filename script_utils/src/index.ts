
import { genNAB, genP } from "./numberGenerator";

import fs from "fs";
import { LoremIpsum } from "lorem-ipsum";


const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 2,
    min: 1
  },
  wordsPerSentence: {
    max: 10,
    min: 5,
  }
});


let { N, A, B } = genNAB();


console.log(N);
console.log(A);
console.log(B);


let writeStream = fs.createWriteStream('random.txt');
writeStream.write(A + " " + B + "\n");

for (let i = 1; i < N + 1; i++) {
  // gen priority
  let P = genP();

  let K = Math.floor((Math.random() - 0.5) * 512);


  let D = lorem.generateWords(10);

  writeStream.write(P + " " + K + " " + D + "\n")
}



writeStream.end();



