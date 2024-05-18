# PrimiStore

Primistore is a password management application that provides a solution to secure your important (or even less important) passwords and provides suggestions regarding safe password practices.

## How does it work? 

### Encryption

- Users generate unique [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) keys and a unique character set (i.e. a way to map characters to numbers) for each of their passwords.
- They then use these unique keys (per password) to encrypt the password and store it as an image (details about how this image is used can be found below).
- They then download the resulting image, that contains their encrypted password and keep it on a storage device of their choice (or in their own device).

### Decryption

- User will upload the image they have on their device.
- The image will be decrypted into stream of bits (using the algorithm described below).
- The decrypted bits are then converted to characters using the unique character set.
- Finally they are decrypted using the AES keys and sent back to the client.

### What is the server storing?

- The server only stores the AES keys and unique character sets for each password that is used to encrypt and decrypt the password. It never stores the actual password image for security reasons. Thus, even if the server is compromised, the passwords are safe.

### Target device

- The entire app (frontend/backend) is meant to be served from a Raspberry Pi running a Ubuntu Server 22.04 LTS image. The choice was made, as PIs are cheap and can be easily used as small home servers. 

## Documentation

- [Image‐Decryption Microservice Design](https://github.com/anglerfishlyy/primistore/wiki/%23-Image%E2%80%90Decryption-Microservice-Design).
- [Image processing algorithm for decryption](https://github.com/frankhart2018/primistore/wiki/Image-processing-algorithm-for-decryption)
- [Instructions to use the app](https://github.com/frankhart2018/primistore/wiki/How-to-use-the-app%3F)
- [Overview of codebase](https://github.com/frankhart2018/primistore/wiki/Codebase)

## Steps to run

### Pre-Requisites

- Before installing anything else, I recommend downloading and installing OpenSSL. OpenSSL is an open source library for all things encryption/hashing. It is used in this project for AES encryption/decryption. So, without OpenSSL, this application is pretty much useless. 

### Install and run

The project can be run either using PM2 process manager (requires installation of Node.js and PM2) or inside a docker container (nothing required other than docker). Out of the two docker is probably an easy solution for most.

Both steps require you to clone the repository:

```bash
$ git clone https://github.com/frankhart2018/primistore.git
```

Let's dive into the individual steps for both of the above listed processes.

### Using PM2

1. Install Node.js for your platform (I am not going to tell you how to do it, just google it).

2. Install React dependencies:

```bash
$ cd frontend
$ npm i
```

3. Install Node dependencies:

```bash
$ cd microservices/password-manager
$ npm i
```

4. Install FastAPI dependencies:

```bash
$ cd microservices/image-decryptor
$ pip install -r requirements.txt
```

5. Install `pm2` globally:

```bash
$ npm i -g pm2
```

6. Install MongoDB for your platform (Again, not going to tell you, google it).

7. Run all microservices:

```bash
$ cd frontend
$ pm2 start --name frontend npm -- start
$ pm2 start --name mongo "<command-for-running-mongo>"
$ cd ../microservices/password-manager
$ pm2 start --name password-manager npm -- start
$ cd ../image-decryptor
$ pm2 start --name image-decryptor "gunicorn -k uvicorn.workers.UvicornWorker app:app"
```

**Note**: Replace the `<command-for-running-mongo>` with an actual command for your platform, e.g. if you are on macOS and you installed mongo using `homebrew` then the command for running mongo is:

```
mongod --config /opt/homebrew/etc/mongod.conf
```

and thus the mongo `pm2` command becomes:

```bash
$ pm2 start --name mongo "mongod --config /opt/homebrew/etc/mongod.conf"
```

Finally the app should be up and running, so easy wasn't it?

### Using Docker

1. Create a directory to hold charsets:

```bash
$ mkdir charsets
```

2. Find IP address of the host (ifconfig for macOS and Linux systems, ipconfig for windows).

3. Use docker-compose (install this if you don't already have it):

```bash
$ IP=<IP> REACT_APP_PI=<true/false> LOCAL_DIR=<charset-dir-path> docker-compose up -d
```

**Note**: For the first time it will take some time, for later runs, docker will cache things (I hope you have a high level idea of how docker works, if not google it). The `REACT_APP_PI` should be turned on (i.e. set to true) if the app is being run on a raspberry pi, otherwise it can be turned off (i.e. set to false)

## License

This project is licensed under [MIT License](https://github.com/frankhart2018/primistore/blob/master/LICENSE).
