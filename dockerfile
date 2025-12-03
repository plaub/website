# ----------------------------------------------------------------
# Stage 1: Build Phase
# Uses a Node.js environment to build the Astro site
# ----------------------------------------------------------------
FROM node:20-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and start the build process
COPY . .
RUN npm run build

# ----------------------------------------------------------------
# Stage 2: Serve Phase
# Uses a lightweight NGINX container to serve the static files
# ----------------------------------------------------------------
FROM nginx:alpine

# Remove the default NGINX websites
RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the 'builder' stage
# Astro's static output is located in the 'dist' folder by default
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]