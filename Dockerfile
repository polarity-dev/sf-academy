FROM node:19

WORKDIR /usr/app
COPY . /usr/app
ENV PORT=8080
EXPOSE 8080

RUN npm install

CMD [ "npm", "start" ]
