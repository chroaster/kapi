#!/bin/bash
echo 'Starting deploy to remote'
echo 'Starting rsync...'
rsync -truv  --exclude '.env' --exclude 'node_modules' --exclude 'deploy.sh' --delete --delete-excluded * chroaster@139.162.7.146:/home/chroaster/apps/kapi

echo 'Copying (scp) .env.prod to remote as .env'
scp .env.prod chroaster@139.162.7.146:/home/chroaster/apps/kapi/.env

echo 'Finished uploading to remote'