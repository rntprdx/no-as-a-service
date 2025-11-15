# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Expose the port the app uses
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
