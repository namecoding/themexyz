#!/bin/bash

# Server credentials
USER="themexyz"
HOST="145.223.88.190"
PASSWORD="GqvKbdDhgv6xDXUu8ACL"

# Remote path
REMOTE_DIR="~/htdocs/www.themexyz.com"

# Commands to run on the server
REMOTE_COMMANDS="
cd $REMOTE_DIR &&
git pull origin main &&
npm install --legacy-peer-deps &&
npm run build &&
pm2 restart themexyz
"

# Run commands on server using sshpass
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USER@$HOST "$REMOTE_COMMANDS"
