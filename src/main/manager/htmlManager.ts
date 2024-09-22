import { Crypto } from "../entity/crypto";

export class HtmlManager {
    
    rowsToTable(cryptoList : Crypto[]) : string {
        let html = '<table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">'+
                '<tr><th>1</th><th>1</th><th>1</th></tr>'
        for(let crypto of cryptoList){
            html += '<tr>'
            html += '<td>'+crypto.name+'</td>'
            html += '<td>'+crypto.quantity+'</td>'
            html += '<td>'+crypto.price+'</td>'
            html += '</tr>'
        }

        html += '</table>'
        

        return html
    }


}