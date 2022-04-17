FROM node:17-alpine

WORKDIR /home/node/app/exchange

COPY ./package.json ./package.json
RUN npm i --silent --no-update-notifier --dev

COPY ./proto ./proto
COPY ./npm_scripts ./npm_scripts
COPY ./exchange ./

RUN npm_scripts/start-exchange-docker.sh