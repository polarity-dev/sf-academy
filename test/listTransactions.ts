import { it, describe } from "mocha"
import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import { apiPort, apiHost } from "./config"

chai.use(chaiHttp)

const url = `${apiHost}:${apiPort}`

const id1Jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MCwiZXhwIjo4NjQwMDAwMDAwMDAwfQ.0azRevqgK7kT0c6sVLxMMPtoCJMx9GjE4Xp4qDKR5DM"
const id100Jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMCwiaWF0IjowLCJleHAiOjg2NDAwMDAwMDAwMDB9.20B7GFD2MvielMdHPY17jgvzEPrwK1ywGdApQCtFHmo"

describe("GET /listTransactions", () => {
   
   it("200 good request", done => {
      chai.request(url)
      .get("/listTransactions")
      .set("Authorization", "Bearer " + id1Jwt)
      .end((err, res) => {
         expect(res).to.have.status(200)
         expect(res.body).to.be.an("array")
         done()
      })
   })

   it("200 empty response", done => {
      chai.request(url)
      .get("/listTransactions")
      .set("Authorization", "Bearer " + id100Jwt)
      .end((err, res) => {
         expect(res).to.have.status(200)
         expect(res.body).to.be.an("array")
         expect(res.body).to.have.length(0)
         done()
      })
   })

   it("401 invalid token", done => {
      chai.request(url)
      .get("/listTransactions")
      .set("Authorization", "Sample Invalid string")
      .end((err, res) => {
         expect(res).to.have.status(401)
         done()
      })
   })
})
