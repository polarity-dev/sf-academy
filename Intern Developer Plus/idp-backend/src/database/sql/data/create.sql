-- Create table data
CREATE TABLE IF NOT EXISTS data
(
    id SERIAL PRIMARY KEY,
    val TEXT NOT NULL,
    batch_timestamp TIMESTAMP DEFAULT NOW()
);
-- Since we show result in descending order I specify a descending index
CREATE INDEX IF NOT EXISTS data_batch_timestamp_desc ON data (batch_timestamp DESC);