#!/bin/bash

# A bash script to be run on Raspberry Pi startup to spin
# up the apps

check_command_installed() {
    OUTPUT=$(which $1)
	if [ -z "$OUTPUT" ]; then
		echo "Please install $2, use 'sudo apt install $2 -y'"
        return 1
	fi

    return 0
}

TOTAL=0
check_command_installed "ifconfig" "net-tools"
TOTAL=$((TOTAL + $?))
check_command_installed "docker" "docker.io"
TOTAL=$((TOTAL + $?))
check_command_installed "docker-compose" "docker-compose"
TOTAL=$((TOTAL + $?))
if [ $TOTAL -gt 0 ]; then
	echo "Some errors exist"
	return 1
fi

IP=`python3 /usr/bin/get_current_ip.py`
LOCAL_DIR=$HOME/.primistore
PIPE_PATH=$HOME/command-runner
PIPE_OUTPUT_PATH=$HOME/output.txt
DOCKER_COMPOSE_PATH=$HOME/docker-compose-prod-pi.yml

mkfifo $PIPE_PATH
while true; do eval "$(cat test)" &> output.txt; done &

sudo IP=$IP LOCAL_DIR=$LOCAL_DIR docker-compose -f $DOCKER_COMPOSE_PATH up -d