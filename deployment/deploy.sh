#!/bin/bash

set -e

. ./vm.config
host="$username.cs.colman.ac.il"
app_dir="~/social-media"

echo "🚀 Deploying to $username@$host..."

sshpass -p $password ssh $username@$host "pm2 delete social-media" || echo "PM2 process 'social-media' not running, skipping..."
sshpass -p $password ssh $username@$host "rm -rf $app_dir/server $app_dir/client" || echo "App directories do not exist, skipping..."

sshpass -p $password ssh $username@$host "mkdir -p $app_dir" \
&& sshpass -p $password scp -r ../server $username@$host:$app_dir \
&& sshpass -p $password scp -r ../client $username@$host:$app_dir \
\
&& echo "=== [1/6] Installing server dependencies ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/server && npm install" \
\
&& echo "=== [2/6] Installing client dependencies ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/client && npm install" \
\
&& echo "=== [3/6] Building client ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/client && npm run build" \
\
&& echo "=== [4/6] Copying client build into server/public ===" \
&& sshpass -p $password ssh $username@$host "cp -r $app_dir/client/dist/. $app_dir/server/public/" \
\
&& echo "=== [5/6] Removing client folder ===" \
&& sshpass -p $password ssh $username@$host "rm -rf $app_dir/client" \
\
&& echo "=== [6/6] Compiling server & pruning dev dependencies ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/server && npm run build:prod" \
\
&& echo "=== [7/7] Starting server with PM2 ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/server && npm run start:prod" \
\
&& echo "✅ Deployment complete!"
