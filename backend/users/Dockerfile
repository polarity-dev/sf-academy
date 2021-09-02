# syntax=docker/dockerfile:1

FROM node:16.8.0-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "users.js" ]

EXPOSE 9001
