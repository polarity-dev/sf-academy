import { it, describe } from "mocha"
import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import { apiPort, apiHost } from "./config"

chai.use(chaiHttp)
const url = `${apiHost}:${apiPort}`

const goodData = {
   email: "valid.email@gmail.com",
   username: "valid username",
   iban: "EE842136117487831851",
   password: "password"
}

const alreadyTakenData = {
   email: "est@yahoo.couk",
   username: "other username",
   iban: "EE842136117487831859",
   password: "password"
}

const invalidData = {
   email: "random@gmail.com",
   password: "invalidPassword"
}

const badData = {
   email: 12,
   password: "password"
}

describe("POST /signup", () => {

   it("201 good request", done => {
      chai.request(url)
      .post("/signup")
      .send(goodData)
      .end((err, res) => {
         expect(res).to.have.status(201)
         expect(res.body).to.be.eql({})
         done()
      })
   })
   
   it("400 bad request", done => {
      chai.request(url)
      .post("/signup")
      .send(badData)
      .end((err, res) => {
         expect(res).to.have.status(400)
         expect(res.body.message).to.be.equal("Bad request")
         done()
      })
   
      it("409 already taken", done => {
         chai.request(url)
         .post("/signup")
         .send(alreadyTakenData)
         .end((err, res) => {
            expect(res).to.have.status(409)
            expect(res.body.message).to.be.equal("Already taken")
            done()
         })
      })
   })
})


