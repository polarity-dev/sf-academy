import * as fs from "fs"
import { generateSlug } from "random-word-slugs"

function getRandomInt(max: number, min = 0): number {
  return Math.floor(Math.random() * (max - min) + min)
}

const maxElements = getRandomInt(50, 1)
const firstValue = getRandomInt(maxElements)
const secondValue = getRandomInt(maxElements + 1, firstValue + 1)
var message = (firstValue + " " + secondValue + "\n")

for (var i = 1; i <= maxElements; i++) {
  message += (getRandomInt(6, 1).toString() + " " + getRandomInt(300, -300).toString() + " " + generateSlug(4, { format: "title" }) + "\n")
}

fs.writeFile("fileData.txt", message, (err) => {
  // throws an error, you could also catch it here
  if (err) {
    throw err
  }
})