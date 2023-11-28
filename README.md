# PrimiStore

Primistore is a password management application that provides a solution to secure your important (or even less important) passwords and provides suggestions regarding safe password practices.

## Documentation

- [Image processing algorithm for decryption](https://github.com/frankhart2018/primistore/wiki/Image-processing-algorithm-for-decryption)

## Steps to run

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

2. Find IP address of the host (ifconfig for macOS and Linux systems, I don't know about windows).

3. Use docker-compose (install this if you don't already have it):

```bash
$ IP=<IP> LOCAL_DIR=<charset-dir-path> docker-compose up -d
```

**Note**: For the first time it will take some time, for later runs, docker will cache things (I hope you have a high level idea of how docker works, if not google it).

## License

This project is licensed under [MIT License](https://github.com/frankhart2018/primistore/blob/master/LICENSE).
