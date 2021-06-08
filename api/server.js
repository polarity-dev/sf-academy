const express = require("express")
const bodyParser = require("body-parser")
const { initialize } = require("express-openapi")
const { join } = require("path")
const cors = require('cors')
const { signUp, login } = require("./services/operations")
const operations = {
    signUp, login
};


const app = express()

app.use(bodyParser.json())
app.use(cors())

initialize({
    app,
    errorMiddleware: (err, req, res) => {
        res.json(err)
    },
    apiDoc: join(__dirname, "./apiDoc.yml"),
    dependencies: {
        log: console.log
    },
    operations
})

app.get("/", (req, res) => {
    res.json({ test: "OK" })
})

app.listen(9002, () => console.log("api listening on port 9002"))