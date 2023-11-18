#!/bin/bash
wget https://raw.githubusercontent.com/frankhart2018/primistore/master/app/docker-compose.prod.yml -O docker-compose.yml
mkdir -p config
LOCAL_DIR=config IP=$1 docker-compose up