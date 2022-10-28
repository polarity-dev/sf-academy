FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]