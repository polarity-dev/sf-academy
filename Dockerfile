# Use the correct base image
FROM node:14

# Set the working directory in the container
WORKDIR ./

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Set the directory where the compiled JavaScript files are located
WORKDIR ./dist

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "app.js" ] # Make sure this points to the compiled main JavaScript file
