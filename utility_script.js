import { lorem, sentence } from "txtgen";
import fs from "fs";

const fileName = process.argv[2];

// check that inserted file name is correct
const periodPos = fileName.lastIndexOf(".");
const fileExtension = fileName.substring(periodPos + 1);
if (fileExtension !== "txt")
  throw new Error("Invalid file extension, it should be .txt");

const N = Math.floor(Math.random() * (51 - 1) + 1); //The maximum is exclusive and the minimum is inclusive
const B = Math.floor(Math.random() * (N + 1));
const A = Math.floor(Math.random() * B + 1);

const stream = fs.createWriteStream(fileName);
stream.once("open", (fd) => {
  stream.write(A + " " + B + "\n");

  for (let n = 0; n < N; n++) {
    const P = Math.floor(Math.random() * (6 - 1) + 1);
    const K = Math.floor(Math.random() * (201 + 200) - 200);
    const D = lorem(1, 3);

    stream.write(P + " " + K + " " + D + "\n");
  }

  stream.end();
});
