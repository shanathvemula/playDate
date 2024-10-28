# Stage 1: Build the app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the built app with Vite's preview server
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY --from=build /app/package*.json ./
RUN npm install --production

# Copy the built files
COPY --from=build /app/dist /app/dist

# Install Vite to use the preview command
RUN npm install -g vite

# Expose port 4173 (default for vite preview)
EXPOSE 4173

# Command to preview the build using Vite's preview server
CMD ["vite", "preview", "--port", "4173"]
