const fs = require("fs");

function fillFile() {
    console.log("[filling file...]");
    const N = random(1, 50);
    const A = random(0, N - 1);
    const B = random(A + 1, N);

    let str = "";

    // prima riga
    str += (`${A} ${B}\n`);

    // N righe
    for(let i = 1; i <= N; i++) {
        let P = random(1, 5);
        let K = random(-255, 255);

        str += (`${P} ${K} ${randomStr()}`);

        if(i != N) str += "\n";
    }

    fs.writeFile("utility/data.txt", str, (error) => {
        if(error) {
            console.log(error);
        }
    });
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomStr() {
    let str = "";

    for(let i = 1; i <= 5; i++) {
        let n = random(97, 122);
        str += String.fromCharCode(n);
    }

    return str;
}

module.exports = fillFile;