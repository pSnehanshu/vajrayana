# Build stage
FROM node:20-slim as build
RUN corepack enable

WORKDIR /var/www/zigbolt

# Copy file
ADD . .

# Install all dependencies
RUN yarn install && \
  yarn prisma generate

# Build frontend
RUN yarn workspace @zigbolt/frontend build


# Final stage
FROM node:20-slim

# Install Nginx
RUN apt-get update && \
  apt-get install -y nginx && \
  # Enable Yarn
  corepack enable

WORKDIR /var/www/zigbolt

# Copy file
COPY . .
COPY docker-assets/nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /etc/nginx/certs
COPY docker-assets/nginx.crt /etc/nginx/certs/nginx.crt
COPY docker-assets/nginx.key /etc/nginx/certs/nginx.key

# Remove the frontend dir
RUN rm -rf ./apps/frontend; \
  yarn install; \
  yarn prisma generate

# Copy frontend built artifacts
COPY --from=build /var/www/zigbolt/apps/frontend/dist /var/www/html

# Make the script executable
RUN mv ./docker-assets/start.sh ./start.sh && \
  chmod +x ./start.sh

EXPOSE 80
EXPOSE 443

ENV NODE_ENV=production

CMD ["./start.sh"]
