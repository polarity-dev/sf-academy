### STAGE 1: Build ###
FROM node:21-alpine AS build
WORKDIR /workspace
COPY package*.json ./
COPY tailwind.config.js ./

RUN npm install

COPY ./src ./src

RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.25.3-alpine
COPY --from=build /workspace/src/ /usr/share/nginx/html
EXPOSE 80
