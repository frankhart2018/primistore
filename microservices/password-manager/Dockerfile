# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Install OpenSSL
RUN apk --no-cache add openssl

# Expose the port that your Node.js app will run on
EXPOSE 4000

# Command to run your application
CMD ["npm", "start"]
