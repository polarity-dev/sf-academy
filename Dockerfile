FROM node:16.13.1-alpine3.14
WORKDIR /usr/src/app
COPY  package.json ./
COPY . .
EXPOSE ${PORT}
RUN npm install --omit=dev
RUN npm run build
CMD npm start 