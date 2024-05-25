# 
<div align="center">
  <h1>Primistore</h1>
  <h2>Locally hosted password management tool for You </h2>
</div>


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

<hr>

## Documentation 🔗

- [Image processing algorithm for decryption](https://github.com/frankhart2018/primistore/wiki/Image-processing-algorithm-for-decryption)
- [Instructions to use the app](https://github.com/frankhart2018/primistore/wiki/How-to-use-the-app%3F)
- [Overview of codebase](https://github.com/frankhart2018/primistore/wiki/Codebase)

<hr>

<div>
  <h2><img src="https://github.com/Meetjain1/wanderlust/assets/133582566/90f3930e-5a12-4a4e-8ac9-0dc7d5396adb" width="35" height="35"> Ready to Contribute ?</h2>
</div>

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

<hr>

<!-- Open Source Programs -->
  <div>
    <h2><img src="https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/blob/master/Emojis/Hand%20gestures/Flexed%20Biceps.png?raw=true" width="35" height="35" > Open Source Programs</h2>
  </div>

  <table border="1" cellpadding="10">
        <tr>
            <td rowspan="2">
                <img src="https://github.com/Meetjain1/wanderlust/assets/133582566/21b2bc42-bdd5-487a-a083-1b262c2f6d9b" alt="GSSOC Logo" width="100" height="55">
            </td>
            <td>
                <strong>GSSOC 2024</strong>
            </td>
        </tr>
        <tr>
            <td>
                This project is a proud participant in GirlScript Summer of Code. We extend a warm welcome to the community to contribute and enhance Primistore.
            </td>
        </tr>
    </table>

<hr>

<!-- Code of conduct -->
<div>
<h2><img src = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png" width="35" height="35"> Code of Conduct</h2>
</div>

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

<hr>

<!-- License -->
<div>
<h2><img src = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20with%20Curl.png" width="35" height="35"> License</h2>
</div>

This project is licensed under the [MIT License](./LICENSE).

<hr>

 <!-- Cotributors -->
<div>
  <h2><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" width="35" height="35"> Contributors</h2>
</div>

Your contributions to our project are immensely appreciated! Thank you for helping to enhance Primistore. 😊

<center>
<a href="https://github.com/frankhart2018/primistore/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=frankhart2018/primistore" />
</a>
</center>

