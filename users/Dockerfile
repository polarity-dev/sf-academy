FROM node:17-alpine

WORKDIR /home/node/app/users

COPY ./package.json ./
RUN npm i --silent --prod --no-update-notifier

COPY ./users/build ./