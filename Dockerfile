# Build stage
FROM node:20 as build
RUN corepack enable

WORKDIR /var/zigbolt

# Copy file
ADD . .

# Install all dependencies
RUN yarn install && \
  yarn prisma generate

# Build frontend
RUN yarn workspace @zigbolt/frontend build


# Final stage
FROM node:20

# Install Nginx
RUN apt-get update && \
  apt-get install -y nginx && \
  # Enable Yarn
  corepack enable

WORKDIR /var/zigbolt

# Copy file
COPY . .
COPY docker-assets/nginx.conf /etc/nginx/nginx.conf

# Remove the frontend dir
RUN rm -rf ./apps/frontend; \
  yarn install; \
  yarn prisma generate

# Copy frontend built artifacts
COPY --from=build /var/zigbolt/apps/frontend/dist /var/www/

# Make the script executable
RUN mv ./docker-assets/start.sh ./start.sh && \
  chmod +x ./start.sh

EXPOSE 80
ENV NODE_ENV=production

CMD ["./start.sh"]
