#!/bin/bash

# Start Nginx in the background
nginx -g 'daemon off;' &

# Migrate the DB
yarn prisma migrate deploy && \

# Start your Node.js script
yarn workspace @zigbolt/backend start
