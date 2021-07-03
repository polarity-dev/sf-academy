CREATE DATABASE IF NOT EXISTS exchange_microservice_database;

USE exchange_microservice_database;

CREATE TABLE IF NOT EXISTS `user`(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `iban` VARCHAR(255) NOT NULL,
    `usd_balance` DOUBLE DEFAULT 0,
    `eur_balance` DOUBLE DEFAULT 0
);
CREATE TABLE IF NOT EXISTS `exchange`(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `execution_date` DATETIME DEFAULT NOW(),
    `transaction_type` ENUM('deposit', 'withdraw', 'buy') NOT NULL,
    `value` DOUBLE NOT NULL,
    `currency` VARCHAR(1) NOT NULL,
    `converted_value` DOUBLE DEFAULT NULL,
    `fk_id_user` INT NOT NULL,
    FOREIGN KEY(`fk_id_user`) REFERENCES `user`(`id`)
);