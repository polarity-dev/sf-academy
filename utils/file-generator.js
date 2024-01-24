const fs = require('fs');

// Genera un numero casuale tra min e max inclusi
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera una stringa numerica casuale di lunghezza specificata
function getRandomNumericString(length) {
    let result = '';
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Genera il file casuale
function generateRandomFile(filePath) {
    
    const numLines = getRandomNumber(1, 50);
    let fileContent = '';
    for (let i = 0; i < numLines; i++) {
        const randomNumber = getRandomNumber(1, 5);
        const randomString = getRandomNumericString(10);
        fileContent += `${randomNumber} ${randomString}\n`;
    }
    fs.writeFileSync(filePath, fileContent);
}

// Esempio di utilizzo

    
const uploadDir = 'randomFiles';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const filePath = '_DIRECTORY_/_FILENAME_.txt';
const updatedFilePath = filePath.replace('_DIRECTORY_', uploadDir);

const generatedRandomName = getRandomNumericString(10);

const finalFilePath = updatedFilePath.replace('_FILENAME_', generatedRandomName);


generateRandomFile(finalFilePath);


