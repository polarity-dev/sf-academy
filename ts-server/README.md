# Intern development

## Backend

Server nodejs:
- `POST /importDataFromFile`: carica i dati 
- `GET /pendigData`: restituisce JSON => lista nomi non processati
- `GET /data`: restituisce JSON => lista dati processati, ordinati in base al timestamp di elaborazione
  - nella stringa di query possono essere passati due flags:
    - `from` => se presente, si dovranno restituire i dati elaborati da questo timestamp in poi
    - `limit` => se presente, i messaggi restituiti avranno questo limite



## Formato del file da processare

## Frontend
