# Build Stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Build client
COPY client ./client
WORKDIR /app/client
RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy server files
COPY server ./server
COPY package*.json ./

# Install only production dependencies for server
WORKDIR /app/server
RUN npm install --production

# Copy built client to server public/dist folder
# Assuming server serves static files from ../client/dist or similar
# We need to adjust server index.js to serve static files if not already
COPY --from=build /app/client/dist ./public

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "src/index.js"]
