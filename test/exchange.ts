import { it, describe } from "mocha"
import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import { apiPort } from "./config"

chai.use(chaiHttp)

describe("GET /exchange", () => {
   it("200 good request", done => {
      const data = {
         value: 100,
         from: "USD",
         to: "EUR"
      }
      chai.request(`0.0.0.0:${apiPort}`)
      .get(`/exchange`)
      .query(data)
      .end((err, res) => {
         expect(res).to.have.status(200)
         expect(res).to.be.a("object")
         done()
      })
   })

   it("400 bad request", done => {
      const data = {
         value: -10,
         from: "EUR",
         to: "USD"
      }
      chai.request(`0.0.0.0:${apiPort}`)
      .get(`/exchange`)
      .query(data)
      .end((err, res) => {
         expect(res).to.have.status(400)
         console.log(res.body)
         expect(res.body).to.be.a("object")
         done()
      })
   })
})


