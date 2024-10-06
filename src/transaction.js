const { program } = require('commander');
const db = require("./main/manager/dbManager");
const cm = require("./main/manager/cryptoManager");

program
  .requiredOption('-c, --crypto <crypto>')
  .requiredOption('-t, --type <type>')
  .option('-q, --quantity <quantity>','', 1)

program.parse()
program.opts()
const options = program.opts();
const cryptoOpt = options.crypto
const typeOpt = options.type
const quantityOpt = parseFloat(options.quantity)

const dbManager = new db.DbManager()
const cryptoManager = new cm.CryptoManager()

void (async () => {
    if(cryptoOpt && typeOpt){
        if(typeOpt === 'sell' || typeOpt ==='buy'){
            let result = db.getCryptoByName(cryptoOpt)
            if(result.rows.lenght === 0)
                result = db.getCryptoById(cryptoOpt)

            if(result.rows.lenght === 0){
                console.log('errore nel recupero della crypto')
            } else {
                const user = db.getUserById(1).rows[0]
                const crypto = result.rows[0]
                const resultWallet  = await dbManager.getUserWallet(user.id)
                const wallet = resultWallet.rows
                const isValid = cryptoManager.checkIfTransactionIsValidWithData(quantityOpt, typeOpt, wallet, user, crypto);
                
                if(isValid){
                    const walletIndex = wallet.findIndex((x) => x.cryptoId === crypto.id);
                    
                    if(typeOpt === 'sell'){
                        if(walletIndex !== -1) {
                            wallet[walletIndex].quantity -= quantityOpt;
                            dbManager.updateUserWallet(wallet[walletIndex]);
                        }
                        
                        user.balance = Math.round((user.balance + (quantityOpt * crypto.price)) * 100) / 100;

                        crypto.quantity += quantityOpt;
                        dbManager.updateCryptoQuantity(crypto);
                    } else { 

                        crypto.quantity -= quantityOpt;
                        dbManager.updateCryptoQuantity(crypto);
                    
            
                        user.balance = Math.round((user.balance - (quantityOpt * crypto.price)) * 100) / 100;
            
                        if(walletIndex !== -1) {
                            wallet[walletIndex].quantity += quantityOpt;
                            dbManager.updateUserWallet(wallet[walletIndex]);
                        } else {
                            dbManager.insertUserWallet(user.id, crypto.id, quantityOpt);
                        }
                    }
                }
            } 
        }else{
            console.log('il campo type puo\' essere solo sell o buy') 
        }
    }else {
        console.log('i campi crypto e type sono obbligatori')
    }

})