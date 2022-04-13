FROM node:17-alpine

WORKDIR /home/node/app/users

COPY ./package.json ./package.json
RUN npm i --quiet --no-update-notifier

COPY ./proto ./proto
COPY ./npm_scripts ./npm_scripts
COPY ./users ./

RUN npm_scripts/start-users-docker.sh