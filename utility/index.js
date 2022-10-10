fs = require("fs");

console.log("Starting script...");

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function randomData(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const rows = randomIntFromInterval(1, 50);
const B = randomIntFromInterval(2, rows);
const A = randomIntFromInterval(1, B - 1);

let fileOutput = `${A} ${B}\n`;

for (let i = 1; i <= rows; i++) {
  if (A <= i && i <= B) {
    fileOutput += `${i} ${randomIntFromInterval(-200, 200)} ${randomData(10)}\n`;
  } else {
    fileOutput += `${i} ${randomIntFromInterval(-200, 200)} ... dummy data ...\n`
  }
}

fileOutput = fileOutput.slice(0, -1);

fs.writeFile("data.txt", fileOutput, function (err) {
  if (err) return console.log(err);
  console.log("DONE! result is in data.txt");
});
