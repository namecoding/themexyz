ssh themexyz@145.223.88.190
cd ~/htdocs/www.themexyz.com
pwd   # confirm you're in the right folder
ls -la

# example, assuming git and branch 'main'
git fetch --all
git pull origin main
# install deps and build if needed (Node example)
npm ci
npm run build

pm2 restart themexyz --update-env