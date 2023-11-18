#!/bin/bash
wget https://github.com/frankhart2018/primistore/blob/master/app/docker-compose.prod.yml -O docker-compose.yml
mkdir -p config
LOCAL_DIR=config IP=$1 docker-compose up