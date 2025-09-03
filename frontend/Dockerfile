# ---------- Stage 1: Build ----------

# Use official Node.js 18 image and name this stage "build"
FROM node:18 AS build

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (so Docker can cache layers)
# Copy Yarn Berry required files first
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Enable corepack to manage Yarn versions
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Install dependencies with Yarn using lockfile
RUN yarn install --frozen-lockfile

# Copy all frontend source code
COPY . .

# Build the production-ready frontend (outputs to /app/dist)
RUN yarn build


# ---------- Stage 2: Serve ----------

# Use lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy built files from build stage into Nginx's default web root
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx config with your custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run Nginx in foreground (so container stays alive)
CMD ["nginx", "-g", "daemon off;"]
