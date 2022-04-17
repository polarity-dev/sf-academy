FROM node:17-alpine

WORKDIR /home/node/app/exchange

COPY ./package.json ./
RUN npm i --silent --prod --no-update-notifier

COPY ./exchange/build ./
