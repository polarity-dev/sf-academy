
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send("hello dmo")
})

app.post('/importDataFromFile', (req, res) => {
  res.send("post")
})

app.get('/pendingData', (req, res) => {
  res.send("get pending data")
})

app.get('/data', (req, res) => {
  res.send("get data")
})


app.listen(port, () => {
  console.log("Running on port " + port)
})



