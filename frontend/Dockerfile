FROM node:lts-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install

RUN npm -g install serve

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["serve", "dist"]
