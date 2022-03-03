# ExchangeMicroservice
## info repo

Questa repo permette di avviare l'intero applicativo tramite Docker. Di seguito viene prima illustrato la composizione del contentuto:
>  - exchangeMiseroservice:
>     - backendTS:
>       - api
>       - exchange
>       - users
>     - frontend
>       - exchange-app
>     - docker-compose

## Inizializzazione

Per permettere l'esecuzione in locale tramite docker-compose bisogna popolare i file .env presenti nei vari microservizi. Internamente ad ogni cartella (api,exchange e users) bisogna rinominare i file "env-sample" in ".env" per poi popolarli come di seguito: 

- exchangeMicroservice/backendTS/api :
```shell
PORT=80
USERSPORT=9001
EXCHANGEPORT=9000
```
- exchangeMicroservice/backendTS/exchange:
```shell
PORT=9000
```

- exchangeMicroservice/backendTS/users:
```shell
PORT=9001
DB_HOST=exchange-db.ckswklwijr2f.eu-west-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=exchange_usr
DB_PASSWORD=FZgt5srd9CVC
DB_NAME=exchange_db
```
questo file conterrà le relative porte per ogni microservizio e collegamento con DB Postrgress in RDS.

## Avvio

Anche se il backend si trova all'interno di una EC2 ed avviato tramite docker-compose, per problemi di comunicazione con EC2 e AWS S3, al momento l'applicativo potrà essere avviato soltanto localmente.

Avviare un terminale all'interno della cartella exchangeMicroservice ed eseguire il seguente comando: 
```shell
docker-compose up
```

o per terminare
```shell
docker-compose down
```

Se si desidera avviare frontend e backend con npm, bisogna entrare nella cartella di ogni servizio e digitare in terminale i seguenti comandi: 


Installare i pacchetti con:
```shell
npm i
```
Avvio per  microservizi users,exchange e frontend:
```shell
npm run
```

Per server express api:
```shell
npm run dev
```

Inoltre, qualora un giorno si avesse la necessità di migrare le tabelle del DB, all'interno del package.json di users è stata inserita una voce "migrate". Questa voce permetterà di migrare le tabelle nel nuovo db postgress. Di seguito il comando:

```shell
npm run migrate
```

## API Reference 

L'url del microservizio api server express all'interno di docker è  `http://api:80/`

###### In ogni endpoint verrà passato il middleware verifyToken per verificare l'autenticità del token, ed eventualmente estratto l'id per poi passarlo ai client grpc per le varie operazioni.

### Exchange

Permettere di calcolare il cambio di valuta da EUR a USD o viceversa.

**Method**
GET

**Endpoint**
- `/exchange`

**Parameters**
```
{
  value: number,
  currencyFrom: string,
  currencyTo: string,
}
```
**Response**
```
{
  value: number
}
```

### Signup

Permette la registrazione di un nuovo utente. 

**Method**
POST

**Endpoint**
- `/users/signup`

**Parameters**
```
{
  email:string
  password:string
  name:string
  iban:string
}
```
**Response**
```
{
  message: "successfull signup" 
}
```

### Login

Permettere di effettuare il login di users.

**Method**
POST

**Endpoint**
- `/users/login `

**Parameters**
```
{
   email:string
   password:string
}
```

**Response**
```
{
  token: string
}
```

### Auth

Permette di verificare l'autenticità del toke, in caso di esito positivo verranno tornate le info di un utente. Questo enpoint viene usato per il refresh della pagina ed avere la persistenza di un utente tramite il sessionStorage.

**Method**
GET

**Endpoint**
- `/users/auth`

**Parameters**
```
none
```

**Response**
```
{
  email:string
  id:number
  name:stirng
  iban:string
  balanceEUR:number
  balanceUSD:number
  balance:number
}
```

### Deposit

Permette ad un utente di effettuare un deposito da "balance" a "balanceEUR/balanceUSD" sulla piattaforma. Verrà controllato se l'importo da depositare è maggiore del saldo balance, se è così verrà tornato un errore, in caso contrario verrà effettuato il deposito. Le operazioni di depostio verranno salvate nella tabella transactions del db.

**Method**
POST

**Endpoint**
- `/users/deposit`

**Parameters**
```
{
  value:number
  symbol:string
}
```

**Response**
```
{
  message: "deposito effettuato"
}
```

### WithDraw

Permette ad un utente di effettuare un withdraw da "balanceEUR/balanceUSD" a "balance" sul proprio iban. Verrà controllato se l'importo è maggiore del saldo balanceEUR/balanceUSD, se è così verrà tornato un errore, in caso contrario verrà effettuato il withdraw. Le operazioni di withdraw verranno salvate nella tabella transactions del db:

**Method**
POST

**Endpoint**
- `/users/withdraw`

**Parameters**
```
{
  value:number
  symbol:string
}
```

**Response**
```
{
  message: "withdraw effettuato"
}
```

### Buy

Permette ad un utente di effettuare il buy della valuta convertita. Questa operazione verrà salvata nella tabella transactions del db.

**Method**
POST

**Endpoint**
- `/users/buy`

**Parameters**
```
{
  initialValue:number
  value:number
  symbol:string
}
```

**Response**
```
{
  message: "buy effettuato"
}
```

### Transactions

Mostra tutte le transazioni effettuate.

**Method**
GET

**Endpoint**
- `/users/:id/transactions`

**Parameters**
```
  none
```

**Response**
```
{
  id:number
  user:number
  value:number
  currency:string
  date:string
  typeOperations:string
}
```

### Balance

Permettere di ricevere i vari balance aggiornati dopo le operazioni di withdraw, deposit e buy.

**Method**
GET

**Endpoint**
- `/users/balance`

**Parameters**
```
  none
```

**Response**
```
{
  balanceEUR:number
  balanceUSD:number
  balance:number
}
```

## EXCHANGE Reference

Il microservizio grpc exchange espone una sola funzione per il recupero della valuta.


### Exchange

`exchange(number value, string currencyFrom, string currencyTo)`


## Users Reference

Questo microservizio in grpc si occupa delle varie operazioni user. Alla registrazione, ad ogni utente verrà forninto un "balance" casuale da 100 a 15000 per simulare un saldo iban ed effettuare le varie operazioni (deposit,withdraw e buy). Una volta effettuato il login, ogni utente dovrà effettuare un deposito sui saldi del conto (balanceEUR, balanceUSD) per poter effettuare i vari buy e withdraw.
* balance si limita a modificare il valore nel db.

Il DB in RDS è composto da due tabelle, users e transactions.

```
Table user{
   increments id: primary
   string email : notNullable unique
   string password: notNullable
   string name : notNullable 
   string iban : notNullable unique
   integer balance: notNullable
   integer balance_eur: notNullable
   integer balance_usd: notNullable
}
```
```
Table transactions{
  increments id : primary
  integer user_id: foreignKey references "id" inTable users
  string typeOperations: notNullable
  integer value: notNullable
  string currency: notNullable
  date date
}
```

Funzioni grpc:

- signup(email: string, password: string, name: string, iban: string)
- login(email: string, password: string)
- deposit(value: number ,symbol: string, id: number)
- withdraw(value: number ,symbol: string, id: number)
- buy(initialValue: number, value: number, symbol: string, id: number)
- listTransactions(userId: string)
- userAuth(userId: string)
- getBalance(userId: string | number)

# Info extra
## parti mancanti

- NGINX 
- OpenAPI

In quanto al momento non di mia conoscenza e studio (da apprendere da autodidatta in quanto nei miei corsi universitari, al momento, non sono previsti)

## EC2 e AWS S3

Info account sandbox per EC2 e AWS S3.

- Account:

    Sign-in URL: https://460761384981.signin.aws.amazon.com/console

    User name: valentino.valenti

    Password: QR2tZfbsSszd

- AWS S3: 

    http://exchangefrontend.s3-website-eu-west-1.amazonaws.com/

- BACKEND EC2: 

    http://18.203.213.111/





