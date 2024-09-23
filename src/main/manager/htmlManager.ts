import { Crypto } from "../entity/crypto";
import { Transaction } from "../entity/transaction";

export class HtmlManager {
    
    cryptoToTable(cryptoList : Crypto[]) : string {
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

    transactionToTable(transactionList : Transaction[], showStatus : boolean) : string {

        let html = '<table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">'+
                '<tr><th>1</th><th>1</th><th>1</th><th>1</th>'

        if(showStatus){
            html += '<th>1</th>'
        }
        
        html += '</tr>'

        for(let transaction of transactionList){
            html += '<tr>'
            html += '<td>'+transaction.cryptoName+'</td>'
            html += '<td>'+transaction.quantity+'</td>'
            html += '<td>'+transaction.price+'</td>'
            if(showStatus){
                html += '<td>'+transaction.status+'</td>'
            }
            html += '<td>'+transaction.type+'</td>'
            html += '</tr>'
        }

        html += '</table>'
        

        return html
    }


}