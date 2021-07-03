FROM node:16-alpine3.11 as builder

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

FROM nginx

COPY --from=builder /app/build/ /usr/share/nginx/html

EXPOSE 5000
