# syntax=docker/dockerfile:1
FROM postgres
ENV POSTGRES_USER       = "docker"
ENV POSTGRES_PASSWORD   = "docker"
ENV POSTGRES_DB         = "docker"
COPY ./init/init.sql /docker-entrypoint-initdb.d/