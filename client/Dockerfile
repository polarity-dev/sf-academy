FROM nginx:1.21.6-alpine

ARG API_PORT
ARG CLIENT_HOST
ARG CLIENT_PORT

COPY ./client/nginx.conf .
RUN envsubst < ./nginx.conf > /etc/nginx/nginx.conf

COPY ./client/build /usr/share/nginx/html