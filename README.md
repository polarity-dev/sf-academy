# SF Academy - Intern Developer test
Questa webApp permette di caricare dati tramite un file txt, processandoli e salvandoli in un database e per poi poterli recuperare tramite una chiamata HTTP.

## Installazione con Docker
Per inizializzare il Docker container, si deve eseguire il comando:
```
docker-compose up
```
(Per cambiare le environment variables, aggiornare il file .env senza modificare i nomi delle variabili. Poi rieseguire il comando)
## Installazione script
La prima volta che si utilizza lo script bisogna eseguire il comando:
```
npm run firstPopulator
```
Dal momento che si hanno installato la dependencies per gli script, si può procedere con l'esecuzione dello script:
```
npm run populator
```

## Utilizzo
- Per utilizzare l'applicativo come webApp, accere all'url `{HOSTNAME}:3000` (ad esempio `localhost:3000`)
- Oppure per utilizzarlo come API, usare i seguenti endpoints:
  - `POST /importDataFromFile`: permette di caricare un file da processare
  - `GET /pendingData`: restituisce in formato JSON la lista dei dati non ancora processati
  - `GET /data`: restituisce in formato JSON la lista dei dati già processati, ordinati secondo il timestamp di elaborazione. In query string potranno essere passati 2 parametri:
    - `from`: se presente vengono restituiti i dati elaborati da questo valore (inteso come timestamp) in poi
    - `limit`: se presente vengono limitati a questo valore il numero di messaggi restituiti

È disponibile una documentazione completa sull'API all'url `{HOSTNAME}:3000/api-documentation` (ad esempio `localhost:3000/api-documentation`)

### Il file da processare deve avere il seguente formato:
- La prima riga contiene due numeri `A` e `B`
- Successive `N` righe contenenti ognuna un numero `P` (con `1 <= P <= 5`) che rappresenta la priorità, un secondo valore `K` seguito da stringa `D`. Vengono considerate solo le righe comprese tra gli indici 1-based indicati da `A` e `B`

esempio:
```txt
3 5
1 128 ... dummy data ... 
4 65 ... dummy data ... 
3 0 prima riga utile
5 -165 seconda riga
3 0 terza riga
5 -165 ... dummy data ... 
```
È disponibile uno [script](#installazione-script) per generare un file con il formato richiesto.

## Note
Di default,  i dati del database non vengono mantenuti ogni volta che si rifà un `docker-compose up`; scommentando la [line 15 docker-compose](https://github.com/Tond28/sf-academy/blob/98442ff1ca669d4bc98113cd0bed20eae70a70b1/docker-compose.yml#L15), i dati verranno salvati in `/db/data` e per resettare il db, bisogna cancellare la cartella `/db/data` prima di fare un `docker-compose up`