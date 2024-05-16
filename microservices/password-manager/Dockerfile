# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install TypeScript
RUN npm install -g typescript

# Copy the rest of your application code
COPY . .

# Install OpenSSL
RUN apk --no-cache add openssl

# Expose the port that your Node.js app will run on
EXPOSE 4000

# Compile TypeScript
RUN tsc

# Command to run your application
CMD ["node", "dist/app.js"]