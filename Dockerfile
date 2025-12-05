FROM node:20-bullseye AS build
WORKDIR /app

# Copy package manifests and install (uses npm ci for reproducible installs)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to leverage Docker's layer caching
COPY package*.json ./

# Install dependencies, including 'serve'
RUN npm install

# Copy the application's build output or static files
COPY build ./build

# Expose the port where 'serve' will listen
EXPOSE 3000

# Command to run 'serve' on the build directory, listening on all interfaces
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
