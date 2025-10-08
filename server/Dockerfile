# Use a specific, stable version of Node
FROM node:18.20.2-alpine

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

EXPOSE 5000

# The command to start the app
CMD ["node", "index.js"]