CREATE TABLE cryptocurrencies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(10) NOT NULL UNIQUE,
  price NUMERIC(18, 8) NOT NULL
);

-- Creazione della tabella degli utenti
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  balance_euro NUMERIC(18, 2) NOT NULL DEFAULT 100000
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  crypto_id INTEGER REFERENCES cryptocurrencies(id),
  action VARCHAR(10), -- 'buy' o 'sell'
  amount NUMERIC,
  price_at_transaction NUMERIC,
  status VARCHAR(10), -- 'pending', 'completed', 'failed'
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella del portafoglio degli utenti
CREATE TABLE user_portfolio (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  crypto_id INTEGER REFERENCES cryptocurrencies(id),
  amount NUMERIC NOT NULL DEFAULT 0,
  UNIQUE (user_id, crypto_id)
);

-- Inserimento dell'utente iniziale
INSERT INTO users (name, balance_euro) VALUES ('default_user', 100000);
