const { program } = require('commander');
const db = require("./main/manager/dbManager");

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

void (async () => {
    if (cryptoOpt && typeOpt) {
        if (typeOpt === 'sell' || typeOpt === 'buy') {
            let result = await dbManager.getCryptoByName(cryptoOpt);
            if (result.rows.length === 0) {
                result = await dbManager.getCryptoById(cryptoOpt);
            }

            if (result.rows.length === 0) {
                console.error('Errore nel recupero della crypto');
            } else {
                const user = (await dbManager.getUserById('1')).rows[0];
                const crypto = result.rows[0];
                const resultWallet = await dbManager.getUserWallet(user.id);
                const wallet = resultWallet.rows;
                const isValid = checkIfTransactionIsValidWithData(quantityOpt, typeOpt, wallet, user, crypto);
                
                console.log(`User balance: ${user.balance}`);
                console.log(`Crypto price: ${crypto.price}`);
                console.log(`Transaction valid: ${isValid}`);
                
                if (isValid) {
                    const walletIndex = wallet.findIndex((x) => x.cryptoid === crypto.id);
                    if (typeOpt === 'sell') {
                        console.log('Inizio vendita', crypto.name);
                        if (walletIndex !== -1) {
                            wallet[walletIndex].quantity -= quantityOpt;
                            dbManager.updateUserWalletWithData(wallet[walletIndex].userid, wallet[walletIndex].cryptoid, wallet[walletIndex].quantity, wallet[walletIndex].id);
                        }

                        // Verifica se user.balance e crypto.price sono numeri validi
                        if (!isNaN(user.balance) && !isNaN(crypto.price)) {
                            user.balance = Math.round((parseFloat(user.balance) + (quantityOpt * parseFloat(crypto.price))) * 100) / 100;
                        } else {
                            console.error('Errore nel calcolo del bilancio: balance o prezzo non validi');
                        }

                        crypto.quantity += quantityOpt;
                        dbManager.updateCryptoQuantity(crypto);
                    } else { 
                        console.log('Inizio compera', crypto.name);
                        crypto.quantity = parseFloat(crypto.quantity) - quantityOpt;
                        dbManager.updateCryptoQuantity(crypto);
            
                        if (!isNaN(user.balance) && !isNaN(crypto.price)) {
                            user.balance = Math.round((user.balance - (quantityOpt * crypto.price)) * 100) / 100;
                        } else {
                            console.error('Errore nel calcolo del bilancio: balance o prezzo non validi');
                        }
            
                        if (walletIndex !== -1) {
                            wallet[walletIndex].quantity = parseFloat(wallet[walletIndex].quantity) + quantityOpt;

                            dbManager.updateUserWalletWithData(wallet[walletIndex].userid, wallet[walletIndex].cryptoid, wallet[walletIndex].quantity, wallet[walletIndex].id);
                        } else {
                            dbManager.insertUserWallet(user.id, crypto.id, quantityOpt);
                        }
                    }
                    dbManager.updateUserBalance(user);
                    console.log('Transazione completa');
                    console.log('Nuovo bilancio : ', user);

                } else {
                    console.error('La transazione non è valida');
                }
            } 
        } else {
            console.error('Il campo type può essere solo sell o buy');
        }
    } else {
        console.error('I campi crypto e type sono obbligatori');
    }

    function checkIfTransactionIsValidWithData(quantity, type, wallet, user, crypto){
        if (type === 'sell') {
            if (wallet.length === 0) {
                return false;
            } else {
                const x = wallet.findIndex((x) => x.cryptoid === crypto.id);
                if (x !== -1 && wallet[x].quantity >= quantity) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if (crypto.quantity >= quantity) {
                if (user.balance >= quantity * crypto.price) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
})();
