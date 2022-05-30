FROM node:lts-alpine as base
WORKDIR /usr/app
COPY package*.json ./

# Build for production
FROM base as builder
ENV NODE_ENV=development
COPY . ./
RUN npm ci && npm run build

# Copy build files and nginx.conf to nginx image
FROM nginx:stable-alpine as production
COPY --from=builder /usr/app/build/ /usr/share/nginx/html
COPY --from=builder /usr/app/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

# Dev image
FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . ./
CMD ["npm", "run", "start"]
