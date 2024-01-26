# Setup iniziale
Per eseguire il progetto è necessario avere installato docker, docker-compose e postgreSQL. Una volta avviato docker basta eseguire il comando `"npm start"` per avviare il progetto. Le varie dipendenze verranno installate automaticamente.

Per accedere al sito basta andare all'indirizzo `localhost:3000` dal browser.

# Descrizione
Il progetto è composto da una sola pagina html che permette di creare randomicamente un file e caricarlo su un server, in modo che il suo contenuto venga messo su un database in modo asincrono. Viene poi data la possibilità di visualizzare il contenuto del database aggiornato impostando anche dei filtri di ricerca.

L'utility script che genere il file può essere avviato dall'applicazione stessa tramite il pulsante "Ricrea file" e il file si troverà nella cartella `text` all'interno della cartella principale `intern_developer_plus`.