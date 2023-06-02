# USERS
Modulo del progetto `exchange-microservice`

Servizio che implementa le funzionalità utente `users`. Si interfaccia con `exchange` quando avviene una richiesta che implica un cambio di valuta.

## Struttura
- Dentro `src/auth` ci sono le funzionalità di autenticazione tramite JWT.
- `src/models` contiene le interfacce delle entità mappate nel DB. Questa cartella è stata generata automaticamente tramite il comando `yarn pg-schema` (eseguibile solo da questa directory). E' necessario avere le seguenti variabili d'ambiente: `DB_NAME`, `DB_HOST_FROM_OUTSIDE`, `DB_PORT`, `DB_PASSWORD` e `DB_USER` relative alle credenziali del DB postgres.
- Nella cartella `src/db` sono implementate le funzionalità di CRUD del DB.
- In `src/services` troviamo l'implementazione dei servizi gRPC. Un file per funzione esposta.
- In `proto/` sono definiti i protobuf, mentre in `src/proto` si trovano i relativi file compilati.
- `src/utils` contiene funzioni utilitarie.
