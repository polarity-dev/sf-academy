let fs = require('fs');

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

function generateRandomFileWithPriority() {
    let randomFile = fs.createWriteStream('./randomFileWithPriority.txt');
    let randomLines = Math.random() * 50;
    for (let i = 0; i < randomLines; i++) {
        let randomLine = Math.floor((Math.random() * 5 + 1)) + ' ' + generateRandomString(15);
        randomFile.write(randomLine + '\n');
    }
    randomFile.end();
}

generateRandomFileWithPriority();