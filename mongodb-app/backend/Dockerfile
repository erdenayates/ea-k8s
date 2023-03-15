# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install cors

# Copy the rest of the application files to the container
COPY . .

# Expose port 3002 for the application
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:secure"]