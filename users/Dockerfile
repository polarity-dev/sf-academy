FROM node:17-alpine

WORKDIR /home/node/app/users

COPY ./package.json ./
RUN npm i --omit=dev

COPY ./users/build ./