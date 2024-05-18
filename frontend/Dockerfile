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

# Expose the port that your React app will run on
EXPOSE 3000

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]