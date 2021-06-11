# Soluzione di exchange-microservice

[![Website](https://img.shields.io/website?label=EXCHANGE%20APP&style=flat&url=http://exchangeapp.s3-website.eu-central-1.amazonaws.com/)](http://exchangeapp.s3-website.eu-central-1.amazonaws.com/)

## Obiettivo

Sviluppare una piattaforma che consenta agli utenti autenticati di simulare l'acquisto di dollari in cambio di euro e viceversa.
La piattaforma dovrà prevedere una registrazione degli utenti, la visualizzazione del proprio saldo e dello storico delle transazioni, e la possibilità di eseguire versamenti acquisti e ritiri di denaro.
L'intero applicativo potrà essere testato localmente grazie a docker, ma viene anche hostato online grazie ad AWS.

## Descrizione

L'infrastruttura si divide in 3 componenti principali:

- RDS
  - mysql
- EC2
  - exchange microservice
  - users microservice
  - api microservice
- S3
  - react webapp

Ognuna di queste tre parti è realizzata su un servizio differente offerto da AWS
Localmente invece per ogni servizio viene creata un immagine docker diversa, le 6 immagini create comunicano grazie al file `docker-compose.yml`

## Installazione

- Per poter scaricare l'applicativo e testarlo localmente basta aver installato [docker](https://docs.docker.com/get-docker/) e aver docker in funzione sulla macchina
- Clona la repository
- Nella cartella troverai un file `.env.template`, rinomina il file in `.env` e compilane il contenuto con i dati richiesti

```dotenv
MYSQL_PASSWORD=<password>
MYSQL_ROOT_PASSWORD=root
JWT_SECRET=<segreto>
DB_URI=mysql://admin:<password>d@db_service:3306/utentiMicroservice
```

- A questo punto basta aprire un cmd nella cartella e scrivere:

```bash
docker-compose up
```

## Utilizzo

Localmente l'applicazione sarà attiva sulla porta [80](http://localhost), mentre se si vuole interagire direttamente con l'API il servizio si trova sulla porta [9002](http://localhost:9002) oppure direttamente dalla porta 80 sulla root `/api/` [qui](http://localhost/api).
La descrizione dettagliata del funzionamento dell'API si trova in `./api/apiDoc.yml` nella cartella del progetto.

## Deploy su AWS

Per fare un deploy dell'applicativo sul proprio account di AWS basterà rinominare il file `terraform.tfvars.template` in `terraform.tfvars` e cambiarne il contenuto in base alle proprie specifiche.
È necessario ottenere le chiavi di accesso dal proprio account di AWS.
Sarà anche necessario avere [AWS cli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installato sulla propria macchina e collegato sul proprio account.
Se si fanno modifiche ai file dei servizi: `users`, `exchange` o `api` sarà necessario cambiare anche la fonte delle immagini docker `EC2Config` in quanto installano i serivizi prendendo le immagini dal mio account di docker hub.
