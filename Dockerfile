FROM node:16
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE ${API_PORT}
CMD ["npm", "start", "--only=production"]