import { it, describe } from "mocha"
import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import { apiPort, apiHost } from "./config"

chai.use(chaiHttp)
const url = `${apiHost}:${apiPort}`

const id1Jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MCwiZXhwIjo4NjQwMDAwMDAwMDAwfQ.0azRevqgK7kT0c6sVLxMMPtoCJMx9GjE4Xp4qDKR5DM"
const invalidToken = "invalidToken"

describe("GET /getUser", () => {
   
   it("200 good request", done => {
      chai.request(url)
      .get("/getUser")
      .set("Authorization", "Bearer " + id1Jwt)
      .end((err, res) => {
         expect(res).to.have.status(200)
         expect(res.body).to.be.an("object")
         done()
      })
   })

   it("401 invalid token", done => {
      chai.request(url)
      .get("/getUser")
      .set("Authorization", invalidToken)
      .end((err, res) => {
         expect(res).to.have.status(401)
         done()
      })
   })
})
