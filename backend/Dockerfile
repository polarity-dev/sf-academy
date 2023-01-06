
FROM node:lts-alpine

WORKDIR /usr/frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["npm", "start"]
