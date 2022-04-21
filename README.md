# Sf Academy: exchange microservice
Una piccola app per convertire e comprare euro e dollari

### Installazione
Per copiare i file env
```
cp .env-sample-prod .env
cp .env-sample-dev .env.dev
```

Per rendere eseguibili gli scripts
```
chmod +x npm_scripts/*
```

### Istruzioni per Docker
Per avviare i containers
```
NODE_ENV=production npm start
```
Per testarli (da eseguire in un'altra shell mentre i container sono attivi)
```
NODE_ENV=production npm test
```
Per compilare i singoli servizi senza eseguirli nei container
```
sh npm_scripts/build-<service-name>.sh
```
I file compilati saranno nella cartella `<service-name>/build`

### Istruzioni locali
Per avviare i processi node
```
npm start
```
Per testarli (da eseguire in un'altra shell mentre i processi sono attivi)
```
npm test
```

### Note
Con docker-compose, il container nginx `client` servira' la webapp statica su `/` e inoltrera' le richieste che iniziano con `api` all'api.
Dunque l'api e' sia raggiungibile da `${API_HOST}:${API_PORT}` sia da`${CLIENT_HOST}:${CLIENT_PORT}/api`
In locale (senza containers), l'api e il frontend saranno raggiungibili da porte diverse, rispettivamente `${API_PORT}` e `${CLIENT_PORT}`
