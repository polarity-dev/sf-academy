# Intern Developer

Realizzare un web server in NodeJs e Typescript che esponga la seguente lista di endpoint:

- /listUsers (GET)
    - Restituisce in formato JSON l’utente richiesto se presente nel database
- /addUser (POST)
    - Permette di aggiungere un utente nel database
- /login (POST)
    - Restituisce uno status code di 200 se i dati di accesso sono corretti, uno stato di 401 in caso non lo siano
- / (GET)
    - Restituisce una semplice pagina html attraverso la quale sia possibile svolgere con una semplice interfaccia grafica tutte le operazioni elencate sopra

Utilizzare docker-compose per orchestrare la soluzione di sviluppo locale che dovrà contenere:
- Applicativo di NodeJs
- Database

Tutto quello che non e’ specificato nella consegna e’ intenzionalmente lasciato alla libera interpretazione del candidato.
