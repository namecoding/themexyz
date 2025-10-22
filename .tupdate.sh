#!/bin/bash

# === Local Git Update ===
echo "🔄 Updating local git repo..."

# Use custom message if provided, otherwise generate a timestamped one
COMMIT_MESSAGE=${1:-"Auto commit - $(date '+%Y-%m-%d %H:%M:%S')"}

git add .
git commit -m "$COMMIT_MESSAGE"
git push origin main

# === VPS Deployment ===
USER="themexyz"
HOST="145.223.88.190"
PASSWORD="GqvKbdDhgv6xDXUu8ACL"
REMOTE_DIR="~/htdocs/www.themexyz.com"

REMOTE_COMMANDS='
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd '"$REMOTE_DIR"' || exit

echo "🔁 Pulling latest changes..."
GIT_OUTPUT=$(git pull origin main)
echo "$GIT_OUTPUT"

if echo "$GIT_OUTPUT" | grep -q "Already up"; then
  echo "✅ No new changes to deploy. Exiting..."
  exit 0
fi

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️ Building project..."
npm run build

echo "🚀 Restarting PM2..."
pm2 restart themexyz

echo "✅ Deployment completed!"
'

sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USER@$HOST "$REMOTE_COMMANDS"
