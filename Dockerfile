# Base image
FROM node:20-slim as base

# Install Nginx
RUN apt-get update && \
  apt-get install -y nginx && \
  # Enable Yarn
  corepack enable

WORKDIR /var/www/zigbolt

# BUILD STAGE
FROM base as build

# Copy file
ADD . .

# Install all dependencies
RUN yarn install && \
  yarn prisma generate && \
  # Build frontend
  yarn workspace @zigbolt/frontend build


# DEPLOY STAGE
FROM base

# Copy frontend built artifacts
COPY --from=build /var/www/zigbolt/apps/frontend/dist /var/www/html

# Copy node_modules
COPY --from=build /var/www/zigbolt/node_modules /var/www/zigbolt/node_modules

# Copy all files
COPY . .

# Remove the frontend dir
RUN rm -rf ./apps/frontend; \
  yarn prisma generate; \
  # Setup nginx configs and SSL certs
  mv ./docker-assets/nginx.conf /etc/nginx/nginx.conf; \
  mkdir -p /etc/nginx/certs; \
  mv ./docker-assets/nginx.crt /etc/nginx/certs/nginx.crt; \
  mv ./docker-assets/nginx.key /etc/nginx/certs/nginx.key; \
  # Make the script executable
  mv ./docker-assets/start.sh ./start.sh; \
  chmod +x ./start.sh

EXPOSE 80
EXPOSE 443

ENV NODE_ENV=production

CMD ["./start.sh"]
