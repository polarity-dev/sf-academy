# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application's code
COPY . .

# Build the application (if necessary)
RUN npm run build

# Make port 3000 available outside this container
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
