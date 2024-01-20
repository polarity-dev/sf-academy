FROM node:latest AS base
WORKDIR /usr/src/app
COPY package*.json ./

#------------------------------------------------
# Development environment with nodemon
FROM base AS dev
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm install
COPY . .
CMD ["npm", "run", "dev"]
#------------------------------------------------

#------------------------------------------------
# Production environment
FROM base AS prod
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production
USER node
COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "start"]
#------------------------------------------------