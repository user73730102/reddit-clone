FROM node:18-alpine
WORKDIR /app

# 1. Copy package files FIRST
# This layer will only be invalidated if package.json or package-lock.json changes.
COPY package*.json ./

# 2. Install dependencies
# This is the slowest step. It will now use the cache unless you changed your dependencies.
RUN npm install --production

# 3. Copy the rest of your application code
# This layer will be invalidated frequently (every time you change a .js file),
# but since it's AFTER npm install, it won't trigger a slow reinstall.
COPY . .

EXPOSE 5000
CMD ["npm", "start"]