FROM node:17-alpine

WORKDIR /home/node/app/api

COPY ./package.json ./
RUN npm i --silent --prod --no-update-notifier

COPY ./api/build ./