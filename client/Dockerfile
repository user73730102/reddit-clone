# --- STAGE 1: BUILDER ---
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Copy package files FIRST
COPY package*.json ./

# 2. Install ALL dependencies (including devDependencies for the build)
# This is the slowest step and will now be cached effectively.
RUN npm install

# 3. Copy the rest of your application code
# Changing your components will only invalidate the cache from this point onwards.
COPY . .

# Define build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Set environment variables for the build process
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Build the Next.js app
# This step will re-run if your source code changes, but it will NOT re-run npm install.
RUN npm run build

# --- STAGE 2: PRODUCTION ---
FROM node:18-alpine
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production

# We need to copy only the necessary production dependencies.
# We can do this by copying package.json and running npm install --production.
COPY --from=builder /app/package*.json ./
RUN npm install --production

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]