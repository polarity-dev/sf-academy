create table transactions (
    id serial,
    symbol varchar(10),
    quantity real,
    price real,
    date timestamp default clock_timestamp(),
    state varchar(10) default 'pending'
);