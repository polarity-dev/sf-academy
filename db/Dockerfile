FROM postgres:14-alpine

WORKDIR /home/node/app/db

COPY ./db ./
COPY ./db/scripts/init.sql /docker-entrypoint-initdb.d/