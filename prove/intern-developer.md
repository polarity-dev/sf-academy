# Intern Developer

## Descrizione del Progetto

Il progetto prevede la realizzazione di un sistema monolitico per la compravendita di criptovalute, utilizzando dati di mercato simulati. Il sistema dovrà gestire un singolo utente con un saldo iniziale di 100.000 euro.

## Dashboard Web

Sviluppare un'interfaccia web che consenta di:

- Visualizzare la lista delle criptovalute disponibili con il relativo prezzo di mercato in euro.
- Effettuare operazioni di acquisto e vendita di criptovalute.
- Consultare la cronologia delle transazioni effettuate.

Il frontend dovrà essere realizzato utilizzando HTMX e TailwindCSS.

## Backend

Implementare un web server in Node.js e TypeScript utilizzando il modulo [Fastify](https://fastify.dev/). Il server dovrà esporre sia gli endpoint HTML per il frontend sia i seguenti endpoint JSON:

- `GET /api/crypto`: Restituisce la lista delle criptovalute disponibili con il relativo prezzo di mercato in euro.
- `GET /api/transactions`: Restituisce la cronologia delle transazioni di compravendita effettuate.
- `POST /api/transactions`: Esegue l'acquisto o la vendita di una criptovaluta specificata nella richiesta con la quantità indicata.

Le transazioni dovranno essere salvate in un database relazionale PostgreSQL. Gli endpoint JSON saranno destinati esclusivamente all'uso da parte di applicazioni terze, mentre la dashboard web utilizzerà solo endpoint HTML, in conformità con la filosofia di HTMX.

## Gestione del Prezzo di Mercato

Il prezzo di mercato delle criptovalute dovrà essere aggiornato ogni minuto e memorizzato in un database PostgreSQL. Il nuovo prezzo sarà calcolato a partire dal prezzo precedente, con una variazione casuale inferiore al 5% rispetto al prezzo precedente.

Il prezzo iniziale di ogni criptovaluta dovrà essere casuale, compreso tra 1 e 10.000 euro.

## Aggiornamenti in Tempo Reale

Ad ogni variazione del prezzo di mercato, il frontend dovrà aggiornare in tempo reale i prezzi visualizzati. Utilizzare la tecnologia [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) con il modulo [@soluzioni-futura/sse-manager](https://www.npmjs.com/package/@soluzioni-futura/sse-manager) per implementare questa funzionalità.

## Task facoltativa

- Ogni richiesta di transazione dovrà essere inserita in una coda anche se non valida (mancanza di credito, ecc.). La coda dovrà essere salvata nel database PostgreSQL.
- La coda dovrà essere gestita in modo asincrono per completare le transazioni in sequenza. In particolare ogni 20 secondi, dovranno essere processate 5 transazioni dalla coda.
- Ogni transazione dovrà essere salvata nel database con il relativo stato (pending, completed, failed).
- Una transazione potrà fallire in caso di mancanza di criptovaluta durante la vendita o di credito di euro durante l'acquisto.
- Lo stato delle transazioni dovrà essere visualizzato in tempo reale nella dashboard web.

## Script di Utility

Creare uno script di utility per effettuare transazioni tramite linea di comando, accettando come argomento la sigla di una criptovaluta, l'azione (buy/sell) e la quantità. Lo script dovrà eseguire l'acquisto o la vendita della criptovaluta e salvare la transazione nel database.

```bash
node transaction.js <crypto> <action> [quantity (default 1)]
```

Utilizzare il modulo [commander](https://www.npmjs.com/package/commander) per la gestione degli argomenti.

## Infrastruttura

Utilizzare Docker Compose per orchestrare l'ambiente di sviluppo locale, includendo:

- L'applicazione monolitica.
- Il database relazionale PostgreSQL.

Tutto ciò che non è specificato nella consegna è lasciato alla libera interpretazione del candidato.
