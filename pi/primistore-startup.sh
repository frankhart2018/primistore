#!/bin/bash

# A bash script to be run on Raspberry Pi startup to spin
# up the apps
IP=`python3 /usr/bin/get_current_ip.py`
LOCAL_DIR=$HOME/.primistore
DOCKER_COMPOSE_PATH=$HOME/docker-compose-prod-pi.yml

sudo IP=$IP LOCAL_DIR=$LOCAL_DIR docker-compose -f $DOCKER_COMPOSE_PATH up -d