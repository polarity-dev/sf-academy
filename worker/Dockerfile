FROM node:16

WORKDIR /app

COPY package*.json ./

RUN  npm install

COPY . .

# ENV PORT=4001

EXPOSE 4001

CMD ["npm", "start"]