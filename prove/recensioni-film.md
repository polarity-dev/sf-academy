# Recensioni film

<img src = "https://img.shields.io/static/v1?label=level&message=medium&color=orange"> <img src = "https://img.shields.io/static/v1?label=&message=web-development&color=informational">

## Contesto

Viene richiesta una piattaforma adibita alla visualizzazione e alla valutazione dei film ottenibili su [http://www.omdbapi.com](http://www.omdbapi.com) .
La piattaforma dovrà prevedere una registrazione degli utenti e una classifica “globale” dei films con le rispettive valutazioni medie.

## Componenti

- API
- Frontend

### API

L’API deve essere hostata su EC2 con database su RDS. L’API deve permettere l’autenticazione dell’utente e il salvataggio delle valutazioni. E’ accettato anche il coinvolgimento di altri servizi di AWS.
L’API deve prelevare i films da [http://www.omdbapi.com].

### Frontend

E’ richiesta una semplice pagina web interattiva che permetta l’interazione con tutte le componenti dell’API (login, visualizzazione classifica e votazione). Questa deve essere realizzata in React, nello specifico usando solo componenti funzionali. La grafica della pagina non sarà discriminante per il successo della prova, ma apprezzata.

### Note

E' obbligatorio l'utilizzo di Docker nella realizzazione dell’applicativo.
L’infrastruttura deve essere realizzata utilizzando un template di Terraform per permettere una riproduzione perfetta del sistema in fase di valutazione.
Verrà attentamente valutato l’utilizzo di GIT (soprattutto i messaggi dei commits sensati). Obbligatoria la stesura di un README esplicativo del progetto realizzato.
Tutte le interazioni con i supervisori riguardanti la prova dovranno avvenire nella sezione issues.
