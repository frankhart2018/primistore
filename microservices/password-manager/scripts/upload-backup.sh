#!/bin/bash

PIPE_COMM_DIR=$HOME/pipe-comm
ASKPASS_SCRIPT=$PIPE_COMM_DIR/askpass.sh

sudo_uninteractive() {
    SUDO_ASKPASS="$ASKPASS_SCRIPT" sudo -A -k $@
}

MONGO_CONTAINER_IDS=$(sudo_uninteractive docker ps -q --filter "ancestor=mongo:bionic")
MONGO_CONTAINER_COUNTS=$(echo $MONGO_CONTAINER_IDS | wc -l)
if [ "$MONGO_CONTAINER_COUNTS" -eq "1" ]; then
    BACKUP_TARBALL_NAME=$1
    BACKUP_TARBALL_PATH=$PIPE_COMM_DIR/$BACKUP_TARBALL_NAME
    CHARSETS_DIR_PATH=charsets
    MONGODUMP_DIR_PATH=dump
    PRIMISTORE_DIR_PATH=$HOME/.primistore

    cd $HOME
    sudo_uninteractive tar -xvf $BACKUP_TARBALL_PATH > /dev/null 2>&1
    sudo_uninteractive cp $CHARSETS_DIR_PATH/*.txt $PRIMISTORE_DIR_PATH 2>/dev/null
    
    MONGO_CONTAINER_ID=$(echo $MONGO_CONTAINER_IDS | head -n 1)
    sudo_uninteractive docker cp $MONGODUMP_DIR_PATH $MONGO_CONTAINER_ID:/ > /dev/null 2>&1
    sudo_uninteractive docker exec $MONGO_CONTAINER_ID "mongorestore" > /dev/null 2>&1
    sudo_uninteractive docker exec $MONGO_CONTAINER_ID rm -rf /dump

    sudo_uninteractive rm -rf $CHARSETS_DIR_PATH $MONGODUMP_DIR_PATH

    echo $BACKUP_TARBALL_NAME
else
    echo "More than one containers running MongoDB, please check your docker setup"
fi