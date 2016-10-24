# References
https://blog.bergeron.io/simple-web-architecture-with-docker/
https://hub.docker.com/r/jefferyb/polymer-cli/~/dockerfile/

# Howto

## install node
## install polymer cli
## install docker
## install docker-compose
## install express generator
    npm install express-generator -g

## Setup sample polymer project

navigate to root
    mkdir client
    cd client
    polymer init
select 'application' for basic application setup

### Test application

    polymer serve --open

## Setup app for serving on Nginx

navigate to root
    cd /client
    mkdir conf/nginx
    cd conf/nginx
create file nginx.conf (see example file for content)

### Create dockerfile for client

Client will be served in production with Nginx therefore we need to provide a config file
navigate to /client
create Dockerfile (see example file /client/dockerfile)

## Test client on docker

Start docker (using docker quickstart terminal)
    $ docker build -t tomedge/nemp-client .
    $ docker run -p 80:80 -d tomedge/nemp-client
    $ docker-machine ip 
Get the ip and then go to the ip in your browser

## (Optional) Stop the docker container

    $ docker ps

This will output something like 

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                NAMES
61f519699247        tomedge/nemp-client      "nginx"             About an hour ago   Up About an hour    0.0.0.0:80->80/tcp   sleepy_nobel

Stop the appropriate container using 

    $ docker stop sleepy_nobel

## Create express app & install dependencies

navigate to root
    express server
    cd server
    npm install

### Test server

    > SET DEBUG=server:*
    > npm start

open http://localhost:3000/ in browser

### Create dockerfile for server

navigate to /server
create Dockerfile (see example file /server/dockerfile)

### Test server on docker

navigate to /server
    $ docker build -t tomedge/nemp-server .
    docker run -p 3000:3000 -d tomedge/nemp-server
    $ docker-machine ip 
Get the ip and then go to the ip:81 in your browser
At this stage you should be able to run both dockerfiles on the same host


## Setup database

### Create dockerfile for database

navigate to root
    > mkdir db

create dockerfile for db (based on https://docs.docker.com/engine/examples/mongodb/)

## Link everything together

navigate to root
create docker-compose.yml (see example file)

## Test everything together

build everything

    ./server $ docker build -t tomedge/nemp-server .
    ./client $ docker build -t tomedge/nemp-client .
    ./db $ docker build -t tomedge/nemp-db .

    $docker-compose up 