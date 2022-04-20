DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "transactions";

CREATE TABLE IF NOT EXISTS "users" (
   "userId" serial primary key,
   "username" varchar (255),
   "email" varchar (255) unique not null,
   "password" varchar (255) not null,
   "iban" varchar (255) not null,
   "usdBalance" float,
   "eurBalance" float
);

CREATE TABLE IF NOT EXISTS "transactions" (
   "transactionId" serial primary key,
   "userId" integer not null,
   "usdDelta" float not null,
   "eurDelta" float not null,
   "type" varchar (255) not null,
   "timestamp" timestamp not null
);
