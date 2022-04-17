import { it, describe } from "mocha"
import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import { apiPort, apiHost } from "./config"
import getToken from "./getToken"

chai.use(chaiHttp)
const url = `${apiHost}:${apiPort}`

const invalidToken = "invalidToken"

getToken().then(token => {
   describe("GET /getUser", () => {
      
      it("200 good request", done => {
         chai.request(url)
         .get("/getUser")
         .set("Authorization", "Bearer " + token)
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
})
