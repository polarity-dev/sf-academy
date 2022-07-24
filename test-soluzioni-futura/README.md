# test-soluzioni-futura

per far partire il progetto molto semplicemente eseguite il git clone ed eseguire il comando


```
docker-compose up 
```

fatto questo aprire il browser web e andare su localhost:8080 per il frontend, il backend è in ascolto sulla porta 3000
gli endpoint dell'API sono


#### Caricamento file
```
POST /importDataFromFile con parametro soluzioni che contiene il file
```

#### Lista dei dati da processare

```
GET /pendingData
```
#### Lista dei dati processati

```
GET /data?from=&limit=
```

#### Generazione file d'esempio

nel progetto è presente anche uno script di utility che genera un file di esempio come da specifiche, per lanciarlo recarsi nella directory backend e lanciare, un file di esempio è presente nella directory del progetto e si chiama [soluzioni.txt](https://github.com/rickytrevor/test-soluzioni-futura/blob/master/soluzioni.txt)

```
npm run generate
```

La modalità di sviluppo del server si attiva con 
```
npm run develop
```

