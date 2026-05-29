# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]