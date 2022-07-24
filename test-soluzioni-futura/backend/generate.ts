import fs from 'fs';
import { LoremIpsum } from "lorem-ipsum";


const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});
let n = Math.floor(Math.random() * 50) + 1;

let a = Math.floor(Math.random() * n) + 1; 
let b = Math.floor(Math.random() * n) + 1;
if(a > b){
    let temp = a;
    a = b;
    b = temp;
}


let str ="";
str += a + " " + b + "\n";
for(let i = 0; i < n; i++){
    let p = Math.floor(Math.random() * 5) + 1;
    let m = Math.floor(Math.random() * 900) -450 ;
    str += p + " " + m + " " + lorem.generateSentences(1) + "\n";
//    str += p + " " + m + "\n";
}


fs.writeFileSync('data.txt', str);