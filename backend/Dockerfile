
FROM node:16

WORKDIR /backend

COPY . /backend/

RUN npm install typescript fastify @fastify/postgres pg @types/node @soluzioni-futura/sse-manager --save-dev
RUN npx tsc --init
RUN npx tsc

EXPOSE 3000

ENV ADDRESS=0.0.0.0 PORT=3000

# Run the application
CMD ["node", "src/index.js"]