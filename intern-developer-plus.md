# Intern Developer +

Dovrà essere realizzato un'applicazione web che permetta di importare dati da un file e di visualizzarli. I dati importati dovranno essere processati in modo asincrono e salvati su un database relazionale PostgreSQL.

Dovrà essere fornito un file README che descriva come installare e avviare l'applicazione. Dopo una prima configurazione, dovrà essere possibie avviare l'applicazione con il solo comando `npm start`.

Le tecnologie da utilizzare sono:

- NodeJS + Typescript
- [Express](https://www.npmjs.com/package/express)
- PostgreSQL
- [HTMX](https://htmx.org/)
- [Tailwind](https://tailwindcss.com/)

## Backend

Realizzare un web server in NodeJs e Typescript che esponga la seguente lista di endpoint:

- `POST /importDataFromFile`: permette di caricare un file da processare come indicato di seguito
- `GET /pendingData`: restituisce in formato JSON la lista dei dati non ancora processati
- `GET /data`: restituisce in formato JSON la lista dei dati già processati, ordinati secondo il timestamp di elaborazione. In query string potranno essere passati 2 parametri
  - `from`: se presente si dovranno restituire i dati elaborati da questo valore (inteso come timestamp) in poi
  - `limit`: se presente dovrà essere limitato a questo valore il numero di messaggi restituiti

Il file da processare conterrà una o piú righe contenenti ognuna un numero `P` (con `1 <= P <= 5`) che rappresenta la priorità, seguito da stringa `D` che rappresenta il dato.

esempio:

```txt
3 prima riga
5 seconda riga
3 terza riga
1 quarta riga
```

I dati importati non dovranno essere processati immediatamente, ma si dovrà seguire la seguente logica:

- il processing dei dati deve avvenire in blocchi di massimo `15` messaggi ogni `10` secondi
- si devono processare i dati in ordine di priorità: prima le priorità alte, in seguito le priorità basse. Ad esempio, se è presente almeno un dato con priorità `3`, questo dovrà essere processato prima di passare ai dati con priorità `2` o `1`
- se viene effettuato un import prima che il precedente sia concluso, si dovranno trattare i precedenti dati non ancora processati come se fossero stati importati insieme ai nuovi (ossia si dovranno accorpare i dati non processati tra loro)
- l'elaborazione di un messaggio consiste nel salvare il valore `D` su un DB, associando il timestamp di elaborazione (che dovrà essere lo stesso per tutti i messaggi dello stesso blocco)

Si implementino gli endpoint utilizzando [Express](https://expressjs.com/it/).

## Frontend

Realizzare un pannello web che permetta di:

- Caricare file da far processare al backend
- Recuperare i dati processati, con la possibilità di impostare i filtri sopra citati

Si implementi il frontend utilizzando [HTMX](https://htmx.org/) e [Tailwind](https://tailwindcss.com/)

## Utility Script

Dovrà essere realizzato uno script di utility che, quando lanciato, generi un file random (di `N` righe con `1 <= N <= 50`) che segua la struttura del file riportato in precedenza.

## Infrastruttura locale

Utilizzare docker-compose per orchestrare la soluzione di sviluppo locale che dovrà contenere:

- Backend
- Frontend
- Database relazionale PostgreSQL

Tutto quello che non è specificato nella consegna è intenzionalmente lasciato alla libera interpretazione del candidato.
