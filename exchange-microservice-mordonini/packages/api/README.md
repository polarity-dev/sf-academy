# API
Modulo del progetto `exchange-microservice`

Questo servizio funge da intermediario tra il `frontend` e il microservizio che implementa le funzionalità utente `users`.

## Struttura
- Dentro `src/routes` ci sono gli _handler_ che gestiscono le richieste in arrivo.
- `src/models` contiene le interfacce degli oggetti inclusi in richieste e risposte
- In `src/proto` si trovano i file protobuf compilati.
- Nella cartella `src/users-client` c'è il client grpc per comunicare con il servizio `users`.
- `src/utils` contiene funzioni utilitarie.
- `openapi.yaml` contiene le specifiche OpenAPI.
