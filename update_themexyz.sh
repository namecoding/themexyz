#!/bin/bash

USER="themexyz"
HOST="145.223.88.190"
PASSWORD="GqvKbdDhgv6xDXUu8ACL"
REMOTE_DIR="~/htdocs/www.themexyz.com"

REMOTE_COMMANDS="
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\"
[ -s \"\$NVM_DIR/bash_completion\" ] && \. \"\$NVM_DIR/bash_completion\"
cd $REMOTE_DIR &&
git pull origin main &&
npm install --legacy-peer-deps &&
npm run build &&
pm2 restart themexyz
"

sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USER@$HOST "$REMOTE_COMMANDS"