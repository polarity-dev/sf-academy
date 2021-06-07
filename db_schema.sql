use utentiMicroservice;

create table users(
    id int(11) auto_increment primary key,
    name varchar(255) not null,
    email varchar(255) unique,
    password varchar(255) not null,
    iban varchar(30) not null,
    balanceUSD double default 0,
    balanceEUR double default 0
);

create table transactions(
    id int(11) auto_increment primary key,
    time datetime default now(),
    transType ENUM('buy', 'withdraw', 'deposit'),
    value double not null,
    symbol varchar(3),
    eValue double,
    eSymbol varchar(3),
    idUser int(11) not null,
    foreign key(idUser) references users(id)
    on update cascade
    on delete cascade
);
