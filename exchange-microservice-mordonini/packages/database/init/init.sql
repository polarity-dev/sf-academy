/* TABLES */

CREATE TABLE users(
    id SERIAL PRIMARY KEY not null,
    email varchar(32) unique not null,
    name varchar(32) not null,
    surname varchar(32) not null,
    passwd char(64) not null,
    creation_date timestamp default CURRENT_TIMESTAMP,
    fingerprint char(64) GENERATED ALWAYS AS (encode(sha256((id::text || email || passwd)::bytea), 'hex')) STORED
);



CREATE TABLE bank_accounts(
    id SERIAL PRIMARY KEY not null,
    iban varchar(50) unique not null,
    creation_date timestamp default CURRENT_TIMESTAMP,
    user_id int not null references users on update cascade on delete no action
);


CREATE TABLE transactions(
    id SERIAL PRIMARY KEY not null,
    creation_date timestamp default CURRENT_TIMESTAMP,
    given_currency numeric default 0.00,
    obtained_currency numeric default 0.00,
    given_currency_type char(3) not null,
    obtained_currency_type char(3) not null,
    transaction_type varchar(20) not null,
    bank_account_id int not null references bank_accounts on update cascade on delete no action
);

/*
CREATE TABLE wallets(
    id SERIAL PRIMARY KEY not null,
    bank_account_id int not null references bank_accounts on update cascade on delete no action,
    currency_type int not null,
    currency_amount numeric not null default 0.00 check (currency_amount > 0)
);*/

/* VIEWS */

/*
CREATE 
OR REPLACE VIEW wallets 
(id, bank_account_id, currency_id, currency_amount)
AS 
SELECT ROW_NUMBER() over (order by t.bank_account_id),
t.bank_account_id,
t.obtained_currency_type,
(CASE WHEN t.obtained_currency_type = t.given_currency_type THEN SUM(t.obtained_currency - t.given_currency) ELSE SUM(t.obtained_currency) END) as currency_amount
from transactions t
group by t.bank_account_id, t.obtained_currency_type, t.given_currency_type;
*/


CREATE 
OR REPLACE VIEW wallets 
(id, bank_account_id, currency_type, currency_amount)
AS 
SELECT row_number() OVER (ORDER BY t.bank_account_id) AS id,
    t.bank_account_id,
    t.obtained_currency_type AS currency_type,
    (COALESCE(( SELECT sum(t2.obtained_currency) AS sum
           FROM transactions t2
          WHERE ((t2.obtained_currency_type = t.obtained_currency_type) AND (t2.bank_account_id = t.bank_account_id))
          GROUP BY t.bank_account_id, t2.obtained_currency_type), (0)::numeric) - COALESCE(( SELECT sum(t2.given_currency) AS sum
           FROM transactions t2
          WHERE ((t2.given_currency_type = t.obtained_currency_type) AND (t2.bank_account_id = t.bank_account_id))
          GROUP BY t.bank_account_id, t2.given_currency_type), (0)::numeric)) AS currency_amount
   FROM transactions t
  GROUP BY t.bank_account_id, t.obtained_currency_type;



/*
INSERT INTO transactions (
    given_currency,
    obtained_currency,
    given_currency_type,
    obtained_currency_type,
    transaction_type,
    bank_account_id
  )
VALUES (
    50,
    30,
    1,
    2,
    3,
    1
  );
*/