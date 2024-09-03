
FROM node:16

WORKDIR /backend

COPY package*.json ./

RUN npm install --save-dev

COPY . . 

RUN npm run build

EXPOSE 3000

# Run the application
CMD ["npm", "start"]