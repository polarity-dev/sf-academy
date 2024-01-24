# Stage 1: Build stage
FROM node:14 AS build
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Final stage
FROM node:14 AS final
COPY --from=build . .
CMD ["npm", "start"]
EXPOSE 5000