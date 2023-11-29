# Pi support

This directory contains all the things that are required to run PrimiStore on Raspberry Pi.

## Description

1. `docker-compose-prod-pi.yml`: This contains completely built images for all microservices, so that it can just be downloaded and run as is to spin up the entire app.

2. `get_current_ip.py`: This fetches the IP address of the device, this is used in automation script to spin up containers on Pi startup. This needs to be moved to `/usr/bin` as the startup script expects so.

3. `primistore-startup.sh`: This is a script that can be run on Pi startup to spin up docker containers for all the microservices of the app.

4. `nptforce`: This has to be copied to `/usr/bin` and given execute permission (`chmod +x`), then running this command from anywhere in the Pi will force an NTP sync and fix the time.
