create table cryptos (
    id serial,
    name varchar(10),
    symbol varchar(10),
    price real,
    owned integer default 0
);