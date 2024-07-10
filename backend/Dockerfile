FROM node:20.14.0-slim
WORKDIR /srv/app/
COPY package.json .
RUN npm i --exclude=dev
COPY dist ./dist
CMD [ "npm", "run", "start" ]