FROM node:17-alpine

WORKDIR /home/node/app/api

COPY ./package.json ./package.json
RUN npm i

COPY ./openapi ./openapi
COPY ./proto ./proto
COPY ./npm_scripts ./npm_scripts
COPY ./api ./

RUN npm_scripts/start-api-docker.sh