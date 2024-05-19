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

# Expose arguments
ARG REACT_APP_PASSWORD_MANAGER_API_BASE
ARG REACT_APP_IMAGE_DECRYPTOR_API_BASE
ARG REACT_APP_PI

# Pass the environment variables
ENV REACT_APP_PASSWORD_MANAGER_API_BASE=$REACT_APP_PASSWORD_MANAGER_API_BASE
ENV REACT_APP_IMAGE_DECRYPTOR_API_BASE=$REACT_APP_IMAGE_DECRYPTOR_API_BASE
ENV REACT_APP_PI=$REACT_APP_PI

# Build the application
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose the port that your React app will run on
EXPOSE 3000

# Command to run your application
CMD ["serve", "-s", "build"]