
# Exchange microservice

### Step 1: Creare il database con RDS

Per il salvataggio dati utenti è necessario creare un database MySQL. L'applicazione utilizza [RDS](https://us-east-2.console.aws.amazon.com/rds/home) per l'hosting di questo servizio. <br>
Un altro strumento utilizzato per la gestione del database è MySQL Workbench (Alternativamente anche MySQL Command Line Client) è reperibile al sito [MySQL](https://dev.mysql.com/downloads/). <br>
Creare il database avente engine MySQL su RDS assicurarsi che nelle inbound rules del security group sia permesso l'accesso al database dal proprio indirizzo IP. <br>

<ol>
  <li> Creare il database avente engine MySQL su RDS. Tenere traccia di master username e master password utilizzate. </li>
  <li> Assicurarsi che nelle inbound rules del security group sia permesso l'accesso al database dal proprio indirizzo IP per la porta 3306. 
    <br>
    <br>
    <img width="850" alt="inbound_rules" src="https://user-images.githubusercontent.com/82449626/132405072-16fe8a1e-3714-48aa-bb82-037342c262d8.png">
    <br>
    <br>
  </li>
  <li> Aprire Workbench e creare una nuova connessione 
    <br>
    <br>
    <img width="585" alt="workbench" src="https://user-images.githubusercontent.com/82449626/132406617-34928e4b-9e33-4599-8117-543c4e3e376a.png"> 
    <br>
    <br>
       Per i campi username e password utilizzare i dati usati in precedenza durante la creazione del database su RDS. Scegliere un nome a piacere per la connessione e lasciare il campo Default schema in bianco. Il campo hostname è recuperabile da RDS nella sezione <code>Connectivity & Security</code> del proprio database.
    <br>
    <br>
    <img width="287" alt="rds_endpoint" src="https://user-images.githubusercontent.com/82449626/132408340-01c92f9c-9ac8-4d0d-b7e6-b01955c47c23.png">
    <br>
    <br>
  </li>
  <li> Connettersi al database ed eseguire il seguente codice per creare le tabelle necessarie: </li>
</ol>

<pre>
CREATE DATABASE exchangedb;
USE exchangedb;

CREATE TABLE users(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  
  email varchar(255) NOT NULL UNIQUE,  
  password varchar(255) NOT NULL,  
  name varchar(255) NOT NULL,  
  iban varchar(30) NOT NULL  
);  

CREATE TABLE accounts(  
  user_id int NOT NULL,  
  currency char(3) NOT NULL,  
  balance decimal(20,4) NOT NULL DEFAULT 0,  
  PRIMARY KEY(user_id, currency),  
  FOREIGN KEY(user_id) REFERENCES users(id)  
);

CREATE TABLE transactions(  
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  
  amount decimal(20,4) NOT NULL,
  currency_from char(3) NOT NULL,  
  currency_to char(3) NOT NULL,  
  user_id int NOT NULL,  
  trans_date datetime NOT NULL DEFAULT NOW(),  
  FOREIGN KEY(user_id) REFERENCES users(id),  
  FOREIGN KEY(user_id, currency_from) REFERENCES accounts(user_id, currency),  
  FOREIGN KEY(user_id, currency_to) REFERENCES accounts(user_id, currency)  
);  
</pre>
