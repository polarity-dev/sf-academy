import { it, describe } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { baseUrl } from "./config";
import getToken from "./getToken";

chai.use(chaiHttp);

getToken().then((token) => {
	describe("GET /listTransactions", () => {
		it("200 good request", (done) => {
			chai
				.request(baseUrl)
				.get("/listTransactions")
				.set("Authorization", "Bearer " + token)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an("array");
					done();
				});
		});

		it("401 invalid token", (done) => {
			chai
				.request(baseUrl)
				.get("/listTransactions")
				.set("Authorization", "Sample Invalid string")
				.end((err, res) => {
					expect(res).to.have.status(401);
					done();
				});
		});
	});
});
