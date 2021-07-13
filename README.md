# SF-Academy | exchange-microservice

## Traccia

Le istruzioni della prova sono disponibili qui: [exchange-microservice.md](https://github.com/soluzionifutura/sf-academy/blob/master/prove/exchange-microservice.md)

## Componenti

I componenti richiesti dalla prova sono quelle sottostanti.

- [x] Backend
  - [x] Exchange Microservice
  - [x] Users Microservice
  - [x] API Microservice
- [x] Frontend
  - [x] React WebApp

## Installazione

### Prerequisiti

- [Docker](https://www.docker.com/get-started), necessario per la riproduzione in locale degli applicativi.

### Come utilizzarlo

  1. Clonare la repository.
  2. Rinomincare il file `.env.template` in `.env` e compilare i campi al suo interno.
  3. Aprire un terminale
  4. Entrare nella cartella `cd /percorso/della/cartella`
  5. Eseguire il comando `docker-compose up --build`

### Informazioni aggiuntive

Si può accedere alla Web App localmente all'indirizzo [http://localhost](http://localhost).

L'accesso all'API può essere effettuata sulla route `api` o direttamente alla porta `9002`

Le funzioni gRPC sono esposte sulla porta `9000` per `exchange` e `9001` per `users`.

## Deploy

Parte di AWS

### Media utilizzati

Qui è presente una lista di media (principalmente delle tecnologie a me nuove) che ho utilizzato per la realizzazio della prova.

- gRPC:
  - [gRPC Crash Course](https://youtu.be/Yw4rkaTc0f8) - Hussein Nasser.
  - [Proto3 | Protobuf](https://developers.google.com/protocol-buffers/docs/proto3)
- OpenAPI
  - [Swagger](https://swagger.io/docs/specification/2-0/basic-structure/)
- Authentication/Authorization:
  - [JWT](https://www.npmjs.com/package/jsonwebtoken)
  - [React Auth Hook](https://usehooks.com/useAuth/)
  - [BCryptJS](https://github.com/kelektiv/node.bcrypt.js#readme)
- Docker
  - [Setting Up a MySQL Database in Docker](https://betterprogramming.pub/setting-up-mysql-database-in-a-docker-d6c69a3e9afe) - Ashutosh Karna.
- nginx
  - [Beginner’s Guide](https://nginx.org/en/docs/beginners_guide.html)
  - [Docker configuration](https://hub.docker.com/_/nginx)
  - [React in Docker with Nginx](https://tiangolo.medium.com/react-in-docker-with-nginx-built-with-multi-stage-docker-builds-including-testing-8cc49d6ec305) - Sebastián Ramírez.
- Terraform
  - [Terraform Docs](https://www.terraform.io/docs/index.html)
  - [Terraform AWS Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
  - [Terraform AWS](https://learn.hashicorp.com/collections/terraform/aws-get-started)
  - [Terraform Course](https://youtu.be/SLB_c_ayRMo) - freeCodeCamp.org
  - [Create database schema with terraform](https://stackoverflow.com/questions/59922023/create-database-schema-with-terraform)
  - [Manage AWS RDS Instances](https://learn.hashicorp.com/tutorials/terraform/aws-rds?in=terraform/aws)
