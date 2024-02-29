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
  # Build admin frontend
  yarn workspace @zigbolt/admin-dash build


# DEPLOY STAGE
FROM base

# Copy admin frontend built artifacts
COPY --from=build /var/www/zigbolt/apps/admin-dash/dist /var/www/html/admin

# Copy node_modules
COPY --from=build /var/www/zigbolt/node_modules /var/www/zigbolt/node_modules

# Copy all files
COPY . .

# Remove the frontend dir
RUN rm -rf ./apps/admin-dash; \
  yarn prisma generate; \
  # Setup nginx configs and SSL certs
  mv ./docker-assets/nginx.conf /etc/nginx/nginx.conf; \
  mkdir -p /etc/nginx/certs; \
  mv ./docker-assets/nginx.crt /etc/nginx/certs/nginx.crt; \
  mv ./docker-assets/nginx.key /etc/nginx/certs/nginx.key; \
  # Make the script executable
  mv ./docker-assets/start.sh ./start.sh; \
  chmod +x ./start.sh; \
  # This file will redirect to /portal
  mv ./docker-assets/redirect-to-portal.html /var/www/html/index.html; \
  # Copy custom error pages
  mv ./docker-assets/404.html /var/www/html/404.html; \
  # Ensure nginx config is valid
  nginx -T;


EXPOSE 80
EXPOSE 443

ENV NODE_ENV=production

CMD ["./start.sh"]
