FROM nginx:1.21-alpine

ARG EXTERNAL_PORT
ARG API_PORT
ARG HOST

COPY ./client/nginx.conf .

RUN envsubst < ./nginx.conf > /etc/nginx/nginx.conf
RUN cat /etc/nginx/nginx.conf

COPY ./client/build /usr/share/nginx/html