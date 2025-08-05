#!/bin/bash

USER="themexyz"
HOST="145.223.88.190"
PASSWORD="GqvKbdDhgv6xDXUu8ACL"
REMOTE_DIR="~/htdocs/www.themexyz.com"

REMOTE_COMMANDS='
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd '"$REMOTE_DIR"' || exit

GIT_OUTPUT=$(git pull origin main)

echo "$GIT_OUTPUT"

if echo "$GIT_OUTPUT" | grep -q "Already up"; then
  echo "No changes to pull. Exiting..."
  exit 0
fi

npm install --legacy-peer-deps
npm run build
pm2 restart themexyz
'

sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USER@$HOST "$REMOTE_COMMANDS"
