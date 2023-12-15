#!/bin/bash

# A bash script to be run on Raspberry Pi startup to spin
# up the apps

check_command_installed() {
	if [ -z "$1" ]; then
		echo "Please install $2, use 'sudo apt install $2 -y'"
        return 1
	fi

    return 0
}

IFCONFIG_OUTPUT=$(which ifconfig)
TOTAL=0
check_command_installed "$IFCONFIG_OUTPUT" "net-tools"
TOTAL=$((TOTAL + $?))
DOCKER_OUTPUT=$(which docker)
check_command_installed "$DOCKER_OUTPUT" "docker.io"
TOTAL=$((TOTAL + $?))
DOCKER_COMPOSE_OUTPUT=$(which docker-compose)
check_command_installed "$DOCKER_COMPOSE_OUTPUT" "docker-compose"
TOTAL=$((TOTAL + $?))
if [ $TOTAL -gt 0 ]; then
	echo "Some errors exist"
	return 1
fi

IP=`python3 /usr/bin/get_current_ip.py`
LOCAL_DIR=$HOME/.primistore
DOCKER_COMPOSE_PATH=$HOME/docker-compose-prod-pi.yml

sudo IP=$IP LOCAL_DIR=$LOCAL_DIR docker-compose -f $DOCKER_COMPOSE_PATH up -d