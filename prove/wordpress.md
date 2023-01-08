# Wordpress

<img src = "https://img.shields.io/static/v1?label=level&message=easy&color=green"> <img src = "https://img.shields.io/static/v1?label=&message=infrastructure&color=informational">

## Contesto

Un cliente ha bisogno di sito in Wordpress. Ti viene affidato il setup dell’infrastruttura necessaria per un ambiente sicuro e affidabile.

## Componenti

- DB
- Componente server

### DB

Il database deve essere hostato su AWS RDS. Impostare un backup quotidiano del database.

### Server

L’applicativo Wordpress deve essere hostato su AWS EC2. Impostare un backup quotidiano del server. Creare i CloudWatch alarms necessari per monitorare lo stato della macchina (disco, cpu, memoria) utilizzando una combinazione di metriche base di CloudWatch (quando disponibili) e di metriche custom inviate tramite l’agent di CloudWatch (da installare sulla macchina) per i valori non monitorati dalle metriche base.

### Note

L’infrastruttura di AWS deve essere creata utilizzando un template di Terraform per permettere una riproduzione fedele quando la prova verrà visionata dal supervisore.
Molto apprezzato un eventuale coinvolgimento di Docker nella realizzazione dell’applicativo.
Verrà attentamente valutato l’utilizzo di GIT (soprattutto i messaggi dei commits sensati). Obbligatoria la stesura di un README esplicativo del progetto realizzato.
Tutte le interazioni con i supervisori riguardanti la prova dovranno avvenire nella sezione issues.
