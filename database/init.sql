create table cryptos (
    id serial,
    name varchar(10),
    symbol varchar(10),
    price real,
    owned integer default 0
);
create table transactions (
    id serial,
    symbol varchar(10),
    quantity integer,
    price real,
    date timestamp default clock_timestamp(),
    state varchar(10) default 'pending'
);
create table budget (
    budget real
);
create or replace function randomInRange(low double precision, high double precision) returns double precision
    language sql
    immutable
    returns null on null input
    return random() * (high - low) + low;

insert into cryptos (name,symbol,price) values 
    ('Bitcoin','BTC',randomInRange(1,10000)),
    ('BNB','BNB',randomInRange(1,10000)),
    ('Ethereum','ETH',randomInRange(1,10000)),
    ('Solana','SOL',randomInRange(1,10000)),
    ('Tether','USDT',randomInRange(1,10000));

insert into budget values (100000);