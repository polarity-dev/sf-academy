FROM node:16-alpine3.11 as builder

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

ARG REACT_APP_NGINX_URI

ENV REACT_APP_NGINX_URI=$REACT_APP_NGINX_URI

RUN npm run build

FROM nginx

COPY --from=builder /app/build/ /usr/share/nginx/html

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5000
