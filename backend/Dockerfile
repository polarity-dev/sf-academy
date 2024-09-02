
FROM node:16

WORKDIR /backend

COPY package*.json ./

RUN npm install --save-dev

COPY . . 

RUN npm run build

EXPOSE 3000

ENV ADDRESS=0.0.0.0 PORT=3000 
ENV DELAY_PRICE_MODIFICATION_MS=1000 DELAY_QUEUE_PROCESSING_MS=20000 
ENV PROCESS_BATCH_SIZE=5

# Run the application
CMD ["npm", "start"]