#!/bin/bash

# Start Nginx in the background
nginx -g 'daemon off;' &

# Start your Node.js script
yarn workspace @zigbolt/backend start
