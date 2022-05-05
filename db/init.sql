CREATE TABLE IF NOT EXISTS processed_data (
    id serial PRIMARY KEY,
    int_k INT NOT NULL,
    str_d TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pending_data (
  id serial PRIMARY KEY,
  priority INT NOT NULL,
  int_k INT NOT NULL,
  str_d TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT now()
);