import { it, describe } from "mocha"
import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import { apiPort, apiHost } from "./config"

chai.use(chaiHttp)
const url = `${apiHost}:${apiPort}`

const data1 = {
   email: "est@yahoo.couk",
   password: "XEV22DZU5SO"
}

const invalidData = {
   email: "random@gmail.com",
   password: "invalidPassword"
}

const badData = {
   email: 12,
   password: "password"
}

describe("POST /login", () => {

   it("201 good request", done => {
      chai.request(url)
      .post("/login")
      .send(data1)
      .end((err, res) => {
         expect(res.body).to.have.property("token")
         done()
      })
   })

   it("401 invalid credentials", done => {
      chai.request(url)
      .post("/login")
      .send(invalidData)
      .end((err, res) => {
         expect(res).to.have.status(401)
         expect(res.body.message).to.be.equal("Invalid credentials")
         done()
      })
   })
   
   it("400 bad request", done => {
      chai.request(url)
      .post("/login")
      .send(badData)
      .end((err, res) => {
         expect(res).to.have.status(400)
         expect(res.body.message).to.be.equal("Bad request")
         done()
      })
   })
})


