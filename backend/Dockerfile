
FROM node:16

# Install netcat
# RUN apt-get update && apt-get install -y netcat

WORKDIR /backend

COPY . /backend/

RUN npm install typescript fastify @types/node pg @types/pg @soluzioni-futura/sse-manager --save-dev
RUN npx tsc --init
RUN npx tsc
# RUN chmod +x /backend/scripts/wait-for-it.sh

EXPOSE 3000

ENV ADDRESS=0.0.0.0 PORT=3000

# Run the application
CMD ["node", "src/index.js"]