#!/bin/bash

tarball() {
    sudo tar czf $1 $2
}

docker_exec() {
    sudo docker exec -it $1 $2
}

MONGO_CONTAINER_IDS=$(sudo docker ps -q --filter "ancestor=mongo:bionic")
MONGO_CONTAINER_COUNTS=$(echo $MONGO_CONTAINER_IDS | wc -l)
if [ "$MONGO_CONTAINER_COUNTS" -eq "1" ]; then
    CURRENT_TIME=$(date +'%d-%m-%Y')
    BACKUP_DIR=$HOME/primistore-$CURRENT_TIME
    BACKUP_TARBALL_PATH=$HOME/$BACKUP_DIR.tar.gz
    PRIMISTORE_DIR=$HOME/.primistore
    PRIMISTORE_TARBALL_PATH=primistore-backup-$CURRENT_TIME.tar.gz
    PIPE_COMM_DIR=$HOME/pipe-comm

    cd $HOME
    mkdir $BACKUP_DIR
    MONGO_CONTAINER_ID=$(echo $MONGO_CONTAINER_IDS | head -n 1)
    docker_exec $MONGO_CONTAINER_ID "mongodump --host localhost --db primistore --quiet"
    sudo docker cp $MONGO_CONTAINER_ID:/dump . > /dev/null 2>&1
    sudo tarball mongodump.tar.gz dump
    sudo mv dump $BACKUP_DIR
    docker_exec $MONGO_CONTAINER_ID "rm -rf /dump"
    mkdir charsets
    cp $PRIMISTORE_DIR/*.txt charsets
    mv charsets $BACKUP_DIR
    tarball $BACKUP_TARBALL_PATH $BACKUP_DIR
    sudo rm -rf $BACKUP_DIR
    mv $BACKUP_TARBALL_PATH $PIPE_COMM_DIR
    echo $BACKUP_TARBALL_PATH
else
    echo "More than one containers running MongoDB, please check your docker setup"
fi