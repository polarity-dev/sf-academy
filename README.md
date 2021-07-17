# SF-Academy | exchange-microservice

Puoi accedere al sito hostato su S3 da [qui](http://exchange-microservice-frontend-s3-bucket.s3-website.eu-west-3.amazonaws.com/)

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

### Come utilizzarlo in locale

1. Clonare la repository.
2. Rinomincare il file `.env.template` in `.env` e compilare i campi al suo interno.
3. Aprire un terminale.
4. Entrare nella cartella `cd /percorso/della/cartella`.
5. Eseguire il comando `docker-compose up --build`.

### Informazioni aggiuntive

Si può accedere alla Web App localmente all'indirizzo [http://localhost](http://localhost).

L'accesso all'API può essere effettuata sulla route `api` o direttamente alla porta `9002`

Le funzioni gRPC sono esposte sulla porta `9000` per `exchange` e `9001` per `users`.

## AWS

Con l'utilizzo di Terraform è possibile riprodurre in maniera perfetta il sistema.

### Infrastruttura

- [x] RDS
  - [x] Database MySQL
- [x] EC2
  - [x] gRPC Exchange  
  - [x] gRPC Users  
  - [x] API
- [x] S3
  - [x] Frontend React

### Requisiti

- [AWS CLI](https://aws.amazon.com/it/cli/), necessario per gestire i servizi AWS.
- [Terraform CLI](https://www.terraform.io/downloads.html), necessario per utilizzare il template Terraform.
- [Node.js / NPM](https://nodejs.org/it/download/), necessario per la build del frontend.

### Come eseguire il deploy

1. Clonare la repository.
2. Rinomincare il file `terraform_template.tfvars` in `terraform.tfvars` e compilare i campi al suo interno.
3. Aprire un terminale.
4. Entrare nella cartella `cd /percorso/della/cartella`.
   1. Se in un sistema Windows, modificare il file `s3_local-exec.sh` cambiare la keyword `export` con `set`.
5. Configurare AWS con `aws configure`.
6. Eseguire il comando `terraform init`.
7. Eseguire il comando `terraform apply -auto-approve`.
8. Attendere l'inizializzazione delle macchine AWS.
   1. Puoi controllare i container facendo `docker ps` all'interno della console direttamente dal browser.
   2. Se sono presenti 6 container all'interno della macchina EC2, vuol dire che è pronto.

## Media utilizzati

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
  - [Terraform Course](https://youtu.be/SLB_c_ayRMo) - [freeCodeCamp.org](https://www.freecodecamp.org/).
  - [Create database schema with terraform](https://stackoverflow.com/questions/59922023/create-database-schema-with-terraform)
  - [Manage AWS RDS Instances](https://learn.hashicorp.com/tutorials/terraform/aws-rds?in=terraform/aws)
  - [Automation of AWS Cloud using Terraform (GitHub included)](https://www.linkedin.com/pulse/automation-aws-cloud-using-terraform-github-included-raghuwanshi/) - Sanya Raghuwanshi.
  - [Deploy an EC2 to run Docker with Terraform](https://klotzandrew.com/blog/deploy-an-ec2-to-run-docker-with-terraform) - Andrew Klotz.
  - [How To Install Docker Compose On Amazon Linux AMI](https://acloudxpert.com/how-to-install-docker-compose-on-amazon-linux-ami/)
  - [Is there a way to get the Public DNS address of an instance?](https://unix.stackexchange.com/questions/24355/is-there-a-way-to-get-the-public-dns-address-of-an-instance)
  - [Deploying a React App with S3 and Terraform](https://www.davidbegin.com/deploying-a-react-app-to-s3-with-terrraform-and-bash/) - David Begin.
  - [Resource: aws_s3_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)
  - [Setting permissions for website access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html)
  - [templatefile Function](https://www.terraform.io/docs/language/functions/templatefile.html)
