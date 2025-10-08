# 1. Base Image for building the app
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy application code
COPY . .

# 5. Define build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 

# 6. Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 

# 7. Build the Next.js app
RUN npm run build

# 8. Production Image
FROM node:18-alpine

WORKDIR /app

# 9. Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# 10. Expose the port the app runs on
EXPOSE 3000

# 11. Command to start the app
CMD ["npm", "start"]