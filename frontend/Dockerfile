# Step 1: Use an official Node.js image as the base image
FROM node:18 as build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application for production
RUN npm run build

# Step 7: Use a lightweight image for serving the static files
FROM node:18-slim

# Step 8: Install a lightweight HTTP server
RUN npm install -g serve

# Step 9: Set the working directory inside the container
WORKDIR /app

# Step 10: Copy the build output from the previous stage
COPY --from=build /app/dist ./dist

# Step 11: Expose the port for the HTTP server
EXPOSE 3000

# Step 12: Serve the build folder
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]




# # Build the Vite app
# FROM node:18-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Use Nginx to serve the files and handle the proxy
# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 3000

# CMD ["nginx", "-g", "daemon off;"]
