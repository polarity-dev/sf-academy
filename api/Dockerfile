FROM node:17-alpine

WORKDIR /home/node/app/api

COPY ./package.json ./
RUN npm i --omit=dev

COPY ./api/build ./