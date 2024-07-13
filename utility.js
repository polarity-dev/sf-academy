const fs = require("fs");

args = process.argv.slice(2);
if (args.length != 1) {
	console.log("Usage: node utility.js <filename>");
	process.exit(1);
}

let fileName = args[0];

function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const N = randomInteger(1, 50);
const B = randomInteger(1, N);
const A = randomInteger(0, B);

console.log(A, B, N);

fs.open(fileName, "w", (err, fd) => {
	if (err) throw err;

	fs.writeFileSync(fd, A + " " + B + "\n", (err) => {
		if (err) throw err;
	});

	fetch(`https://loripsum.net/api/${N}/plaintext`)
		.then((res) => res.text())
		.then((text) => {
			text.split("\n").forEach((line) => {
				if (line.length != 0) {
					fs.writeFileSync(
						fd,
						randomInteger(1, 5) +
							" " +
							randomInteger(-256, 255) +
							" " +
							line +
							"\n",
						(err) => {
							if (err) throw err;
						},
					);
				}
			});
		})
		.then(() => {
			fs.close(fd, (err) => {
				if (err) throw err;
			});
		});
});
