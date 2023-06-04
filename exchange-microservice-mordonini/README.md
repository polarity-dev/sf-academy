# Exchange-microservice
## Struttura del progetto
Questa repo è stata creata come progetto per [_Soluzioni Futura_](https://www.soluzionifutura.it/).
- Nel file `requisiti.md` sono elencati i requisiti del progetto.
- La cartella `packages/` contiene i moduli che definiscono i microservizi del progetto: _api_, _users_, _exchange_, _db_, _frontend_. Al loro interno si trova un `README.md` dove viene riassunto la struttura del modulo stesso.
- `secrets/` è una cartella vuota dove verranno generate le chiavi segrete.
- Dentro `tools/` si trovano i file bash per la generazione delle chiavi
- `.env` contiene le variabili di ambiente con cui è possibile controllare gli entrypoint e altre funzionalità del progetto. Le credenziali del db e le porte di ogni container possono essere modificate lì.\
Nota: non impostare `NODE_ENV='production'`, alcune funzionalità non sono state ancora implementate.
- `docker-compose.yml` è il file di configurazione di docker compose per la fase di development. Contiene informazioni relative ai volumi, variabili di ambiente e network dei container.
- In `docker-compose-production.yml` vi sono istruzioni per effettuare la build delle immagini.
## Dipendenze
### Node.js
Scaricare e installare [nodejs](https://nodejs.org/it/download).
### Yarn
Package manager alternativo a `npm` per node.js
```bash
npm install -g yarn
```
## Buf
[Buf.build](https://buf.build/) è uno strumento open-source per la gestione dei protocol buffer.
```bash
npm install -g @bufbuild/buf
```
Inoltre scaricare il plugin per la compilazione proto<->Javascript [qui](https://github.com/protocolbuffers/protobuf-javascript/releases/tag/v3.21.2).
L'eseguibile deve essere posizionato in una cartella indicizzata da PATH.
### Docker
Installare [docker](https://docs.docker.com/engine/install/)

## OpenSSL
Necessario per la generazione delle chiavi.
### Su linux
```bash
sudo apt install -y openssl
```
### Su macOS via Homebrew
```bash
brew install openssl
```



## Setup
### Build
Effettuare la build del progetto(può impiegare qualche minuto):
```bash
yarn build
```
Questo comando installa tutti i package necessari al progetto e compila i file `.ts` e `.proto` di ogni package. Infine genera le chiavi segrete per la firma dei JWT.

(Opzionale) Dopo aver eseguito comando, è possibile effettuare la build delle immagini docker:
```bash
yarn build:prod
```
Questo comando genera le immagini seguendo le configurazioni contenute in `docker-compose-production.yml`. Ogni microservizio avrà la sua immagine dedicata.
### Avvio
Avviare il progetto con:
```bash
yarn start
```
In questo modo vengono creati dei container aventi immagini "base": `node`, `postgres`, ecc... e gli vengono montati i volumi contenenti i file sorgenti necessari. Il file di configurazione eseguito è `docker-compose.yml`. In questo caso, i microservizi lanciano i server con `nodemon`, di conseguenza una compilazione di anche solo un file `.js` provoca il reset automatico dell'interprete. Questo metodo può essere particolarmente utile in fase di development.

Alternativamente, dopo aver eseguito `yarn build:prod` è possibile eseguire i container come istanze delle loro immagini _ad-hoc_:
```bash
yarn start:prod
```

Una volta avviato il programma è possibile connettersi al frontend all'indirizzo [`localhost:FRONTEND_PORT/`](http://localhost:9004). La porta di default è `9004`
## Documentazione
E' possibile accedere alla documentazione OpenAPI attraverso il servizio `api`, visitando la pagina [`localhost:PORT/api-docs`](http://localhost:9003/api-docs) mentre si può scaricare da [`localhost:PORT/api-docs/download`](http://localhost:9003/api-docs/download). La porta di default è `9003`.
## Altri comandi utili
- `yarn keygen` per generare le chiavi segrete (richiede OpenSSL). Viene chiamato al termine di `yarn build`
- `yarn remove:build` elimina tutti derivati dalla compilazione di `.ts` e `.proto`.
- `yarn build:PACKAGE_NAME` effettua la build di un package singolo. Compila sia file `.ts` sia `.proto`. L'istruzione `yarn build` vista precedentemente esegue questo comando per ogni package. `PACKAGE_NAME` è uno tra: api, frontend, exchange, users.
