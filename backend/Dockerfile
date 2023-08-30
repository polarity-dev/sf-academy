FROM node:alpine
WORKDIR /app

COPY package*.json .

COPY tsconfig.json ./

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]
