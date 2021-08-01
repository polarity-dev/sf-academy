
# Exchange microservice

## Creare il database

Per il salvataggio dati utenti è necessario creare un database MySQL. Gli strumenti utilizzati a questo scopo sono reperibili dal sito [MySQL](https://dev.mysql.com/downloads/).
Una volta installato e configurato MySQL Server è possibile usare la console (MySQL Command Line Client) o installare anche l'applicazione Workbench per eseguire le seguenti query:  

CREATE DATABASE exchangedb;  
USE exchangedb;

CREATE TABLE users(  
&emsp; id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  
&emsp; email varchar(255) NOT NULL UNIQUE,  
&emsp; password varchar(255) NOT NULL,  
&emsp; name varchar(255) NOT NULL,  
&emsp; iban varchar(30) NOT NULL  
);  

CREATE TABLE accounts(  
&emsp; user_id int NOT NULL,  
&emsp; currency char(3) NOT NULL,  
&emsp; balance decimal(20,4) NOT NULL DEFAULT 0,  
&emsp; PRIMARY KEY(user_id, currency),  
&emsp; FOREIGN KEY(user_id) REFERENCES users(id)  
);

CREATE TABLE transactions(  
&emsp; id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  
&emsp; amount decimal(20,4) NOT NULL,  
&emsp; currency_from char(3) NOT NULL,  
&emsp; currency_to char(3) NOT NULL,  
&emsp; user_id int NOT NULL,  
&emsp; trans_date datetime NOT NULL DEFAULT NOW(),  
&emsp; FOREIGN KEY(user_id) REFERENCES users(id),  
&emsp; FOREIGN KEY(user_id, currency_from) REFERENCES accounts(user_id, currency),  
&emsp; FOREIGN KEY(user_id, currency_to) REFERENCES accounts(user_id, currency)  
);  

A questo punto il microservizio user può gestire i dati sul database.
