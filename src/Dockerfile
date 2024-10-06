FROM node:20-alpine
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
EXPOSE 4000