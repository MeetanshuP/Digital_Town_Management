FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

RUN npm install

# Copy source
COPY . .

# Vite default port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]
