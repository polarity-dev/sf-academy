# Intern Developer +

## Installazione

- Eseguire 
  
  ```bash
  git clone https://github.com/ArturGHub/sf-academy.git
  ```

- Entrare nel repo

  ```bash
  cd sf-academy
  ```

- Assicurarsi di essere sul branch giusto

  ```bash
  git checkout intern-developer-plus
  ```

## Esecuzione

- Entrare in `Intern Developer Plus`
  
  ```bash
  cd Intern\ Developer\ Plus/
  ```

- Eseguire
  
  ```bash
  npm start
  ```

- Attendere il setup dei container. Appena si legge sulla console `Server is running at` seguito dalla porta del backend, il sistema è operativo

- Aprire [localhost:4060](http://localhost:4060) sul browser

- Eseguire tutte le operazioni necessarie tramite l'interfaccia user-friendly del sito

- Per fermare il sistema eseguire 
  
  ```bash
  docker-compose down
  ```

## compose.sh

Si può anche gestire docker-compose con il pratico script `compose.sh`.

Esso accetta i seguenti parameti:

- nessuno: esegue normalemente `docker-compose up`

- -d: fa partire compose in detached mode

- -r: passa a compose il flag `--force-recreate`

- -rd: esegue compose con entrambi i parametri precedeni

- -s: ferma l'esecuzione di compose e rimuove tutte le immagini

## API

Il backend espone i seguenti endpoint:

- `POST /importDataFromFile`: accetta un file di testo formattato nel seguente modo:
  
  - Ha una o piú righe contenenti ognuna un numero `P` (con `1 <= P <= 5`) che rappresenta la priorità, seguito da stringa `D` che rappresenta il dato
    
    - Esempio di file valido:
    
      ```txt
      3 prima riga
      5 seconda riga
      3 terza riga
      1 quarta riga
      ```

  - Nel caso in cui il file non aderisca a questa struttura, il frontend restituirà   l'errore `Wrong file format`
  
  - Se il file è conforme, i dati in esso contenuti verranno estratti ed inviati ad una coda con `5` priorità. Ogni `10` secondi verranno presi, se presenti, al massimo `15` messaggi  dalla prima coda non vuota con priorità più alta. Verranno poi salvati sul database con un timestamp comune a tutto il blocco dei messaggi prelevati

- `GET /pendingData`: restituisce in formato JSON la lista dei dati non ancora processati con la seguente struttura:

  ```json
  [
    [
      "1",
      []
    ],
    [
      "2",
      []
    ],
    [
      "3",
      []
    ],
    [
      "4",
      []
    ],
    [
      "5",
      []
    ]
  ]
  ```

  In ogni sotto array, il primo elemento è il livello di priorità della coda, il secondo è una lista di tutti i dati del livello di priorità associato che sono ancora da processare 

- `GET /data`: restituisce in formato JSON la lista dei dati già processati, ordinati in modo discendente (prima i più recenti) secondo il timestamp di elaborazione. In query string potranno essere passati 2 parametri

  - `from`: se presente, verranno restituiti i dati elaborati da questo valore (inteso come timestamp) in poi

    - Il valore deve rispettare il [date time string format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format). In caso contrario, il parametro verrà considerato assente e verranno restituiti tutti i dati

  - `limit`: se presente, il numero di messaggi restituiti verrà limitato a questo valore

    - Se non è presente o è un valore numerico negativo, vengono restituiti tutti i dati

    

  - La risposta JSON ha la seguente struttura:

  ```json
  [
    {
      "id": 794,
      "val": "data string number 2",
      "batch_timestamp": "2024-02-18T18:11:29.423Z"
    },
    {
      "id": 795,
      "val": "data string number 4",
      "batch_timestamp": "2024-02-18T18:11:29.423Z"
    },
    {
      "id": 796,
      "val": "data string number 5",
      "batch_timestamp": "2024-02-18T18:11:29.423Z"
    }
  ]
  ```


## Utility Script

Per generare file di prova con dati e priorità casuali eseguire

```bash
python .generate_data.py -n
```

`-n` è un parametro opzionale che consente di specificare il numero di righe da generare con `1 <= n <= 50`

Se assente, il deafult è `10`