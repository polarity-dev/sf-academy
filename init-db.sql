CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    saldo NUMERIC DEFAULT 100000.00
);

CREATE TABLE crypto (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    price NUMERIC NOT NULL,
    price_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_queue (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    crypto_id INT REFERENCES crypto(id),
    crypto_amount NUMERIC,
    transaction_type VARCHAR(4), -- 'buy' o 'sell'
    price_at_transaction NUMERIC,
    transaction_final_value NUMERIC,
    status VARCHAR(10), -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (username)
VALUES ('admin');

INSERT INTO crypto (name, symbol, price)
VALUES 
('Bitcoin', 'BTC', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Ethereum', 'ETH', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Ripple', 'XRP', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Litecoin', 'LTC', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Cardano', 'ADA', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Polkadot', 'DOT', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Binance Coin', 'BNB', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Solana', 'SOL', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Chainlink', 'LINK', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2)),
('Dogecoin', 'DOGE', ROUND((RANDOM() * (10000 - 1) + 1)::NUMERIC, 2));