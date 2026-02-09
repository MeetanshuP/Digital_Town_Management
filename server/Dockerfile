# server/Dockerfile

# 1. Select the base image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first (optimizes build caching)
COPY package*.json ./

# 4. Install production dependencies
RUN npm ci --only=production

# 5. Copy the rest of the backend code
COPY . .

# 6. Expose the API port (Must match the port your app listens on)
EXPOSE 5000

# 7. Start the server
CMD ["npm", "start"]