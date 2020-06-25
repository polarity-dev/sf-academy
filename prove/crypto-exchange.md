# The Servadei Crypto Exchange

<img src = "https://img.shields.io/static/v1?label=level&message=hard&color=red"> <img src = "https://img.shields.io/static/v1?label=&message=web-development&color=informational"> <img src = "https://img.shields.io/static/v1?label=&message=infrastructure&color=informational"> <img src = "https://img.shields.io/static/v1?label=&message=blockchain&color=informational">

## Contesto
Si deve svolgere un’ ICO (Initial coin offering) di un nuovo token realizzato on-top della blockchain Ethereum.
Si vuole creare una piattaforma web per gestire l’acquisto e la gestione dei tokens.
Come capita spesso in questi casi alcuni investitori hanno fornito del denaro quando ancora non era disponibile lo smart contract sulla blockchain: andranno quindi ricompensati automaticamente alla creazione del contratto con dei token.
-   investitore 1: 10.000$
-   investitore 2: 25.000$
-   investitore 3: 100.000$
ciascuno degli investitori ha comprato i token al prezzo promozionale in prevendita di 0.01$ a token.

## Componenti
-   Smart contract del token
-   API centralized
-   Frontend

### Smart contract del token
Lo smart contract sviluppato in Solidity, deve essere costruito senza dipendenze e deve mettere a disposizione un token con le seguenti funzionalità: airdrop, transfer, balance e burn.
Transfer deve permettere il trasferimento dei token di un utente ad un altro. Balance deve permettere di visualizzare il bilancio dei token posseduti da un utente. Burn deve permettere di eliminare una certa quantità di tokens che si possiedono. Airdrop, dato un array di recipients e un array di values, assegna la quantità di tokens specificata ai recipients. Alla creazione del contratto viene generata una certa quantità di tokens in mano al creatore del contratto. Bisogna poi utilizzare la funzione “airdrop” per assegnare i tokens agli investitori iniziali e la funzione “burn” per eliminare i tokens rimasti.
Per ognuna di queste funzionalità deve essere emesso un evento dallo smart contract.

### API centralized
Per gli utenti finali l’interazione con il contratto potrà avvenire con chiamate dirette al contratto stesso o registrandosi sulla piattaforma web.
Nel secondo caso il portale web effettuerà delle chiamate ad una API che interagirà direttamente la blockchain.
L’API deve permettere agli utenti di registrarsi, visualizzare il proprio bilancio ed effettuare trasferimenti di token in cambio di denaro.
La registrazione di un utente sulla piattaforma richiederà allo stesso di registrare:
-   nome
-   cognome
-   mail
-   password
appena registrato il backend dovrà creare un wallet per l’utente e salvarsi la chiave privata: questa verrà utilizzata dal backend stesso per operare per conto dell’utente.
Attraverso l’API ogni utente deve poter:
-   visualizzare il numero di token presenti sul suo wallet
-   visualizzare il quantitativo di $ presenti sul suo conto
-   depositare $ sul suo conto (un deposito è una semplice chiamata all’api nella quale si specifica un numero di $ e questi si considerano immediatamente versati sul conto dell’utente)
-   piazzare un ordine di vendita di X token al valore di Y $
-   eseguire l’acquisto di un ordine di vendita
-   visualizzare tutti gli ordini di vendita nella piattaforma.
L’API deve essere realizzata utilizzando Node Js ed ExpressJs.

### Frontend

E’ richiesta una semplice pagina web interattiva che permetta l’interazione con tutte le componenti dell’API. Questa può essere realizzata a discrezione del candidato con React o con semplice JavaScript (no altre librerie).  
La grafica della pagina non sarà discriminante per il successo della prova, ma apprezzata (un semplice material design è perfetto).

### Note

L’infrastruttura di AWS deve essere creata utilizzando un template di Terraform per permettere una riproduzione fedele quando la prova verrà visionata dal supervisore.
Molto apprezzato un eventuale coinvolgimento di Docker nella realizzazione dell’applicativo.
Verrà attentamente valutato l’utilizzo di GIT (soprattutto i messaggi dei commits sensati). Obbligatoria la stesura di un README esplicativo del progetto realizzato.
Tutte le interazioni con i supervisori riguardanti la prova dovranno avvenire nella sezione issues.
una semplice chiamata all’api nella quale si specifica un numero di $ e questi si considerano immediatamente versati sul conto dell’utente)

- piazzare un ordine di vendita di X token al valore di Y $
- eseguire l’acquisto di un ordine di vendita
- visualizzare tutti gli ordini di vendita nella piattaforma.

L’API deve essere realizzata utilizzando Node Js ed ExpressJs.
