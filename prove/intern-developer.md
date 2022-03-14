# Intern Developer

## Backend

Realizzare un web server in NodeJs e Typescript che esponga la seguente lista di endpoint:

- `POST /importDataFromFile`: permette di caricare un file da processare come indicato di seguito
- `GET /pendingData`: restituisce in formato JSON la lista dei dati non ancora processati
- `GET /data`: restituisce in formato JSON la lista dei dati già processati, ordinati secondo il timestamp di elaborazione. In query string potranno essere passati 2 parametri
  - `from`: se presente si dovranno restituire i dati elaborati da questo valore (inteso come timestamp) in poi
  - `limit`: se presente dovrà essere limitato a questo valore il numero di messaggi restituiti

Il file da processare avrà il seguente formato:

- La prima riga contiene due numeri `A` e `B`
- Successive `N` righe contenenti ognuna un numero `P` (con `1 <= P <= 5`) che rappresenta la priorità, un secondo valore `K` seguito da stringa `D`. Dovranno essere considerate solo le righe comprese tra gli indici indicati da `A` e `B`

esempio:

```txt
4
1 128 ... dummy data ... 
4 65 ... dummy data ... 
3 0 prima riga utile
5 -165 seconda riga
3 0 terza riga
5 -165 ... dummy data ... 
```

I dati importati non dovranno essere processati immediatamente, ma si dovrà seguire la sequente logica:

- il processing dei dati deve avvenire in blocchi di massimo `15` messaggi ogni `10` secondi
- si devono processare i dati in ordine di priorità: prima le priorità alte, in seguito le priorità basse. Ad esempio, se è presente almeno un dato con priorità `3`, questo dovrà essere processato prima di passare ai dati con priorità `2` o `1`
- se viene effettuato un import prima che il precedente sia concluso, si dovranno accorpare i nuovi dati all'interno dei precedenti
- l'elaborazione di un messaggio consiste nel salvare i valori `K` e `D` su un DB relazionale, associando il timestamp di elaborazione (che dovrà essere lo stesso per tutti i messaggi dello stesso blocco)

## Frontend

Realizzare un semplice pannello web che permetta di:

- Caricare file da far processare al backend
- Recuperare i dati processati, con la possibilità di impostare i filtri sopra citati

## Script utility

Dovrà essere realizzato uno script di utility che, quando lanciato, generi un file random (con `1 <= N <= 50` e `0 <= A < B <= N`) che segua la struttura del file riportato in precedenza.

## Infrastruttura

Utilizzare docker-compose per orchestrare la soluzione di sviluppo locale che dovrà contenere:

- Backend
- Frontend
- Database relazionale

Tutto quello che non è specificato nella consegna è intenzionalmente lasciato alla libera interpretazione del candidato.
