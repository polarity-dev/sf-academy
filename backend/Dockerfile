FROM node:lts-alpine as base
WORKDIR /usr/app
COPY package*.json ./

# Build for production
FROM base as builder
ENV NODE_ENV=development
RUN npm install -g ts-node & npm install
COPY . ./
RUN npm run build

# Copy build files in production node image
FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY --from=builder /usr/app/dist/ ./dist/
CMD ["npm", "run", "start"]

# Dev image
FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . ./
CMD ["npm", "run", "start:dev"]
