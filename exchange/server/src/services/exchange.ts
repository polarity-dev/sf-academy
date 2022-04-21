import xml2js from "xml2js";
import "isomorphic-fetch";
import { ExchangeRequest } from "../../../proto/exchangePackage/ExchangeRequest";
import { ExchangeResponse } from "../../../proto/exchangePackage/ExchangeResponse";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

const URL = "http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const parser = new xml2js.Parser();

const Exchange = (
	call: ServerUnaryCall<ExchangeRequest, ExchangeResponse>,
	callback: sendUnaryData<ExchangeResponse>
): void => {
	fetch(URL)
		.then((response) => response.text())
		.then((content) => parser.parseStringPromise(content))
		.then((data) => data["gesmes:Envelope"]["Cube"][0]["Cube"][0]["Cube"])
		.then((data) =>
			data.map((element: { [key: string]: object }) => element["$"])
		)
		.then((data) => {
			const rates: { [key: string]: number } = {};
			data.forEach((element: any) => {
				rates[element.currency] = parseFloat(element.rate);
			});
			rates["EUR"] = 1;
			return rates;
		})
		.then((rates) => {
			const { value, from, to } = call.request;
			callback(null, {
				value: ((value as number) * rates[to || ""]) / rates[from || ""],
				symbol: to,
			});
		})
		.catch((err) => console.error(err));
};

export default Exchange;
