import { it, describe } from "mocha"
import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import { apiPort, apiHost } from "./config"

chai.use(chaiHttp)
const url = `${apiHost}:${apiPort}`

const goodData = {
   value: 100,
   from: "USD",
   to: "EUR"
}

const badData = {
   value: -1,
   from: "USD",
   to: "EUR"
}

describe("GET /exchange", () => {
   
   it("200 good request", done => {
      chai.request(url)
      .get("/exchange")
      .query(goodData)
      .end((err, res) => {
         expect(res).to.have.status(200)
         expect(res).to.be.a("object")
         done()
      })
   })

   it("400 bad request", done => {
      chai.request(url)
      .get("/exchange")
      .query(badData)
      .end((err, res) => {
         expect(res).to.have.status(400)
         expect(res.body).to.be.a("object")
         done()
      })
   })
})


