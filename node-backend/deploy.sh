#!/bin/bash
cd /home/zuri/animatedtalkingheads.api/node-backend
git checkout staging
git pull
docker-compose up -d --build
