CREATE TABLE IF NOT EXISTS processed_data (
	id SERIAL PRIMARY KEY,
	int_k NUMERIC NOT NULL,
	str_d TEXT NOT NULL,
  timestamp timestamp
);

CREATE TABLE IF NOT EXISTS pending_data (
	id SERIAL PRIMARY KEY,
	priority NUMERIC NOT NULL,
	int_k NUMERIC NOT NULL,
	str_d TEXT NOT NULL,
	timestamp timestamp
)