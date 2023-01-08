CREATE TABLE IF NOT EXISTS messaggi (
  "id" int(11) NOT NULL AUTO_INCREMENT,
  "K" smallint(6) NOT NULL,
  "D" varchar(5) NOT NULL,
  "timestamp" timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY ("id")
);