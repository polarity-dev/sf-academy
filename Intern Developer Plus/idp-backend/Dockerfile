### STAGE 1: Build ###
FROM node:21-alpine AS build
LABEL stage=build
WORKDIR /workspace
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install

COPY ./src ./src

RUN npm run build

### STAGE 2: Run ###
FROM node:21-alpine
WORKDIR /app
COPY --from=build /workspace/package.json package.json
COPY --from=build /workspace/dist ./dist
COPY --from=build /workspace/node_modules ./node_modules
COPY .env .
EXPOSE 8080
CMD [ "npm", "start" ]
