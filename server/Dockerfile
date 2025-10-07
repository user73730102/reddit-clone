# 1. Base Image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# 4. Copy application code
COPY . .

# 5. Expose the port the app runs on
EXPOSE 5000

# 6. Command to start the app
CMD ["npm", "start"]