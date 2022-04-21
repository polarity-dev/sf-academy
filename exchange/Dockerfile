FROM node:17-alpine

WORKDIR /home/node/app/exchange

COPY ./package.json ./
RUN npm i --omit=dev

COPY ./exchange/build ./
