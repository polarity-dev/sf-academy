create table cryptos (
    id serial,
    name varchar(10),
    symbol varchar(10),
    price real,
    owned real default 0
);