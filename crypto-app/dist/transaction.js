"use strict";
// src/transaction.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
// Carica le variabili d'ambiente dal file .env se presente
// Ottieni l'URL dell'API dal file .env o usa il default
const apiUrl = 'http://localhost:3000/api/transactions';
// Funzione principale per eseguire la transazione tramite API
async function executeTransaction(cryptoSymbol, action, quantity) {
    try {
        // Configura le intestazioni, inclusa l'autenticazione se necessaria
        const headers = {
            'Content-Type': 'application/json',
        };
        // Prepara il payload della richiesta
        const payload = {
            crypto: cryptoSymbol,
            action,
            quantity,
        };
        // Effettua la richiesta POST all'API
        const response = await axios_1.default.post(apiUrl, payload, { headers });
        // Gestisci la risposta
        console.log(`Transazione ${action} di ${quantity} ${cryptoSymbol.toUpperCase()} eseguita con successo.`);
        console.log(`Messaggio: ${response.data.message}`);
    }
    catch (error) {
        if (error.response) {
            // Il server ha risposto con un codice di stato diverso da 2xx
            console.error(`Errore: ${error.response.data.error}`);
        }
        else if (error.request) {
            // La richiesta è stata fatta ma non si è ricevuta risposta
            console.error('Errore: Nessuna risposta dal server.');
        }
        else {
            // Qualcosa è andato storto nella configurazione della richiesta
            console.error(`Errore: ${error.message}`);
        }
    }
}
// Configurazione di Commander per gestire gli argomenti della linea di comando
const program = new commander_1.Command();
program
    .name('transaction')
    .description('Script di Utility per eseguire transazioni di criptovalute tramite API')
    .version('1.0.0')
    .argument('<crypto>', 'Simbolo della criptovaluta (es. BTC, ETH)')
    .argument('<action>', 'Azione da eseguire (buy/sell)')
    .argument('[quantity]', 'Quantità da acquistare o vendere', '1')
    .action(async (crypto, action, quantity) => {
    // Validazione dell'azione
    const actionLower = action.toLowerCase();
    if (actionLower !== 'buy' && actionLower !== 'sell') {
        console.error('Errore: L\'azione deve essere "buy" o "sell".');
        process.exit(1);
    }
    // Parsing della quantità
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
        console.error('Errore: La quantità deve essere un numero positivo.');
        process.exit(1);
    }
    // Esegui la transazione tramite API
    await executeTransaction(crypto, actionLower, qty);
});
// Avvia il parsing degli argomenti della linea di comando
program.parse(process.argv);
