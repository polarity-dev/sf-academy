FROM node:lts-alpine   
ENV NODE_ENV: production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*","./"]
RUN npm install --silent
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
