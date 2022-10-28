const fs = require("fs")

var strings = fs.readFileSync("./strings.txt").toString()
strings = strings.split(" ")

function randomize(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min
}

var lineCount = randomize(1, 50)
var start = randomize(0, lineCount)
var end = randomize(start, lineCount)

var stream = fs.createWriteStream("./test.txt")
stream.once('open', function(fd)
{
    stream.write(start+" "+end+"\n")
    for(var i = 0; i<lineCount; i++) stream.write(randomize(1, 5)+" "+randomize(-256, 256)+" "+strings[0+i*4]+" "+strings[1+i*4]+" "+strings[2+i*4]+" "+strings[3+i*4]+"\n")
    stream.end()
})