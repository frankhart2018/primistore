# PI support

This directory contains all the things that are required to run PrimiStore on Raspberry Pi.

## Description

1. `docker-compose-prod-pi.yml`: This contains completely built images for all microservices, so that it can just be downloaded and run as is to spin up the entire app.

2. `get_current_ip.py`: This fetches the IP address of the device, this is used in automation script to spin up containers on Pi startup.
