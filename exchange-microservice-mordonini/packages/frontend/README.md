# FRONTEND
Modulo del progetto `exchange-microservice`.

Il frontend del progetto.
## Struttura
- `public/` e gli altri file (non cartelle) di `src/` sono stati generata automaticamente.
- In `src/app/` è definito il Redux store.
- `src/features` contiene le componenti React e funzionalità per interagire con loro.
- `src/services/openapi` contiene le interfacce per dialogare con il servizio `api`. E' stato generato con il comando `yarn types:openapi` sulla base della configurazione `openapi.yaml` del suddetto package.
- `src/services/api` è un wrapper delle funzionalità appena descritte.

