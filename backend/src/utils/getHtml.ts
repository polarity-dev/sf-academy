import crypto from "../models/crypto";
function tdMaker(value: string,cssClass: string = "") {
    return `<td ${cssClass}>${value}</td>`;
}
export function getCryptoHtml(cryptos: Array<crypto>) {
    var htmlRes = ``;
    for (const crypto of cryptos) {
        htmlRes += "<tr>";
        htmlRes += tdMaker(crypto.name.toString());
        htmlRes += tdMaker(crypto.symbol.toString());
        htmlRes += tdMaker(crypto.price.toString());
        htmlRes += tdMaker(crypto.owned.toString());
        htmlRes += "</tr>";
    }
    return htmlRes;
}
