# Magento serverless

<img src = "https://img.shields.io/static/v1?label=level&message=hard&color=red"> <img src = "https://img.shields.io/static/v1?label=&message=infrastructure&color=informational">

Hostare un applicativo Magento stateless su infrastruttura AWS:

## Applicativi

- Magento 2.3
- Nginx
- Varnish
- Altri applicativi, se necessari, dei quali dove essere fornita motivazione nella pull request

## Infrastruttura

- ECR: registry che contiene la docker image dell’applicativo. E’ a discrezione del candidato la scelta se creare un unico container per tutti gli applicativi o separarli.
- ECS: servizio sul quale sarà eseguito il/i container degli applicativi
- RDS: il database deve trovarsi su un database RDS in rete privata con il cluster di EC2
- cluster di EC2: macchina d’appoggio per ECS. Per la prova il cluster sarà composto da una sola macchina ma all’occorrenza deve poter essere aumentato il numero (utilizzare un autoscaling group) . Opzionale ma gradita una macchina che funga da bastion host per connettersi al database.
- ELB: aggiungere un Application Load Balancer che diriga il traffico sui container del cluster

## Note

La parte relativa all’infrastruttura deve essere realizzata con templates di Terraform.

La parte relativa agli applicativi deve essere scritta in uno o più dockerfiles e deve essere possibile avviare la soluzione localmente tramite un Docker-compose che simuli l’ambiente remoto.

Verrà attentamente valutato l’utilizzo di GIT (soprattutto i messaggi dei commits sensati). Obbligatoria la stesura di un README esplicativo del progetto realizzato.
Tutte le interazioni con i supervisori riguardanti la prova dovranno avvenire nella sezione issues.
