#!/bin/bash

PIPE_COMM_DIR=$HOME/pipe-comm
ASKPASS_SCRIPT=$PIPE_COMM_DIR/askpass.sh

sudo_uninteractive() {
    SUDO_ASKPASS="$ASKPASS_SCRIPT" sudo -A -k $@
}

docker_exec() {
    sudo_uninteractive docker exec $1 $2
}

MONGO_CONTAINER_IDS=$(sudo_uninteractive docker ps -q --filter "ancestor=mongo:bionic")
MONGO_CONTAINER_COUNTS=$(echo $MONGO_CONTAINER_IDS | wc -l)
if [ "$MONGO_CONTAINER_COUNTS" -eq "1" ]; then
    CURRENT_TIME=$(date +'%d-%m-%Y-%s')
    BACKUP_DIR=$HOME/primistore-$CURRENT_TIME
    BACKUP_TARBALL_PATH=$BACKUP_DIR.tar.gz
    PRIMISTORE_DIR=$HOME/.primistore
    PRIMISTORE_TARBALL_PATH=primistore-backup-$CURRENT_TIME.tar.gz

    cd $HOME
    MONGO_CONTAINER_ID=$(echo $MONGO_CONTAINER_IDS | head -n 1)
    docker_exec $MONGO_CONTAINER_ID "mongodump --host localhost --db primistore --quiet"
    sudo_uninteractive docker cp $MONGO_CONTAINER_ID:/dump . > /dev/null 2>&1
    docker_exec $MONGO_CONTAINER_ID "rm -rf /dump"
    mkdir charsets
    sudo_uninteractive cp $PRIMISTORE_DIR/*.txt charsets 2>/dev/null

    sudo_uninteractive tar czf $BACKUP_TARBALL_PATH charsets dump
    sudo_uninteractive rm -rf charsets dump
    sudo_uninteractive rm -rf $BACKUP_DIR
    mv $BACKUP_TARBALL_PATH $PIPE_COMM_DIR

    BASE_BACKUP_TARBALL_PATH=$(basename $BACKUP_TARBALL_PATH)

    echo $BASE_BACKUP_TARBALL_PATH
else
    echo "More than one containers running MongoDB, please check your docker setup"
fi