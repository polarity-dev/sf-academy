const fs = require('fs');

function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function generateFile(filePath, numLines, dataLength) {
  let fileContent = '';
  for (let i = 0; i < numLines; i++) {
    const priority = Math.floor(Math.random() * 5) + 1;
    const data = generateRandomString(dataLength);
    fileContent += `${priority} ${data}\n`;
  }
  fs.writeFileSync(filePath, fileContent);
}

const filePath = './file.txt'; // Replace with your desired file path
const numLines = 50; // Replace with the number of lines you want in the file
const dataLength = 10; // Replace with the length of the data you want in each line

generateFile(filePath, numLines, dataLength);