FROM node:latest
WORKDIR /usr/src/app
COPY . .
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm install
CMD ["npm", "start"]