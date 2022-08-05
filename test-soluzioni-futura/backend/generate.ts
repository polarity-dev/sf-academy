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


var n = Math.floor(Math.random() * 50) + 1;
var a = Math.floor(Math.random() * n) + 1; 
var b = Math.floor(Math.random() * n) + 1;
if(a > b){
    var temp = a;
    a = b;
    b = temp;
}


var str ="";
str += a + " " + b + "\n";
for(var i = 0; i < n; i++){
    var p = Math.floor(Math.random() * 5) + 1;
    var m = Math.floor(Math.random() * 900) -450 ;
    str += p + " " + m + " " + lorem.generateSentences(1) + "\n";
}


fs.writeFileSync('data.txt', str);