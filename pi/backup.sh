#!/bin/bash

tarball() {
    sudo tar czf $1 $2
}

docker_exec() {
    sudo docker exec -it $1 $2
}

MONGO_CONTAINER_COUNTS=$(sudo docker ps -q --filter "ancestor=mongo:bionic" | wc -l)
if [ "$MONGO_CONTAINER_COUNTS" -eq "1" ]; then
    CURRENT_TIME=$(date +%s)
    BACKUP_DIR=primistore-$CURRENT_TIME
    BACKUP_TARBALL_PATH=$BACKUP_DIR.tar.gz
    PRIMISTORE_DIR=.primistore
    PRIMISTORE_TARBALL_PATH=primistore-backup-$CURRENT_TIME.tar.gz

    cd ~/
    MONGO_CONTAINER_ID=$(sudo docker ps -q --filter "ancestor=mongo:bionic" | head -n 1)
    docker_exec $MONGO_CONTAINER_ID "mongodump --host localhost --db primistore --quiet"
    sudo docker cp $MONGO_CONTAINER_ID:/dump . > /dev/null 2>&1
    tarball mongodump.tar.gz dump
    sudo rm -rf dump
    docker_exec $MONGO_CONTAINER_ID "rm -rf /dump"
    sudo mkdir $BACKUP_DIR
    sudo mv mongodump.tar.gz $BACKUP_DIR
    tarball $PRIMISTORE_TARBALL_PATH $PRIMISTORE_DIR
    sudo mv $PRIMISTORE_TARBALL_PATH $BACKUP_DIR
    tarball $BACKUP_TARBALL_PATH $BACKUP_DIR
    sudo rm -rf $BACKUP_DIR
    echo $BACKUP_TARBALL_PATH
else
    echo "More than one containers running MongoDB, please check your docker setup"
fi