# Stage 1: Build Stage
FROM node:alpine AS build

# Set the working directory in the build container
WORKDIR /app

# Copy package.json and package-lock.json to the build container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install TypeScript
RUN npm install -g typescript

# Copy the rest of your application code to the build container
COPY . .

# Compile TypeScript
RUN tsc

# Stage 2: Production Stage
FROM node:alpine

# Set the working directory in the final container
WORKDIR /app

# Copy the compiled code from the build container
COPY --from=build /app/dist ./dist

# Copy only necessary files to the final container
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Install OpenSSL
RUN apk --no-cache add openssl

# Expose the port that your Node.js app will run on
EXPOSE 4000

# Command to run your application
CMD ["node", "dist/app.js"]
