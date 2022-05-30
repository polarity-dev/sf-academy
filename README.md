# Intern Developer

## Avvio con docker

### Sviluppo
Per l'avvio in modalità sviluppo eseguire questo comando:
```bash
docker-compose up
```
Finita la build e avviati i container la webapp sarà accessibile all'url http://localhost:3000

### Produzione
Per l'avvio in modalità produzione eseguire questo comando:
```bash
docker-compose -f docker-compose.prod.yml up
```
Finita la build e avviati i container la webapp sarà accessibile all'url http://localhost

## Generatore file
Per generare i file da caricare installare npm dentro la cartella `/utility/` ed eseguire questo comando:
```bash
npm run generate:data
```
Verrà generato un file con nome random nella cartella `/utility/data/`.

## Database
Sequelize si occuperà di migrare in automatico il database.