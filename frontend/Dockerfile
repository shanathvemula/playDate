# # Use an official Node.js runtime as a parent image
# FROM node:18-alpine

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json (or yarn.lock) to the working directory
# COPY package*.json ./

# # Install the app dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the Vite app for production
# RUN npm run build

# # Install a lightweight HTTP server to serve the static files
# RUN npm install -g serve

# # Expose port 5173 for Vite dev server or 3000 for serve
# EXPOSE 3000

# # Command to serve the build folder
# CMD ["serve", "-s", "dist", "-l", "3000", "--single"]



# Build the Vite app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the files and handle the proxy
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
