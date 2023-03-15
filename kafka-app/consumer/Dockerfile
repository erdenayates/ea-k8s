# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the app source code to the container
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Start the app
CMD ["node", "index.js", "--https"]