# Pi support

This directory contains all the things that are required to run PrimiStore on Raspberry Pi.

## Description

1. `docker-compose-prod-pi.yml`: This contains completely built images for all microservices, so that it can just be downloaded and run as is to spin up the entire app. This should be moved to the home directory.

2. `get_current_ip.py`: This fetches the IP address of the device, this is used in automation script to spin up containers on Pi startup. This needs to be moved to `/usr/bin` as the startup script expects so.

3. `primistore-startup.sh`: This is a script that can be run on Pi startup to spin up docker containers for all the microservices of the app. This should be moved to the home directory.

4. `nptforce`: This has to be copied to `/usr/bin` and given execute permission (`chmod +x`), then running this command from anywhere in the Pi will force an NTP sync and fix the time.

5. `execute_pipe.py`: Reads data from pipe and executes them as commands, dumps the output to an output file. This should be moved to the home directory.

6. `backup.sh`: Pulls in mongodump from mongo docker container, and tarballs the charsets directory into a single tarball with the timestamp of the backup. This needs to be moved to the home directory.
