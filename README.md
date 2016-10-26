# TL;DR

This project gives an example of how to get Node, Express, Mongo + Polymer to play nice when everything is containerised with Docker.

# How to use

If you just want to jump straight in and give this a try navigate to the project root and run
    docker-compose build
    docker-compose up -d
    docker-machine ip
then go to the given ip in your browser

you should see three ticks in the status boxes if everything is ok

To stop run
    docker-compose down

# NEMP stack?

Node, Express, Mongo & Polymer. 

It's basically the MEAN stack with Polymer instead of Angular, but NEMP is easier to say than MEPN

I :heart: this stack

# References

Thanks to the authors of all the posts below, these have been a great help!

How to build a 3 tier architecture in docker
https://blog.bergeron.io/simple-web-architecture-with-docker/

Great article which explains how to set up mongo in docker amongst other things
https://medium.com/@sunnykay/docker-development-workflow-node-express-mongo-4bb3b1f7eb1e#.oqolacqz2

Mongoose Getting Started
http://mongoosejs.com/docs/ 

Using polymer cli to build polymer app in docker
https://hub.docker.com/r/jefferyb/polymer-cli/~/dockerfile/

# Howto

install node
install polymer cli
install docker
install docker-compose
install express generator
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

## Add api methods and mongoose

    npm install --save mongoose
Have a look at the api methods in api.js to see how we talk to the db

## Make app CORS compatible !Important

TODO - see app.use() just after app is defined

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

## Where's my database? 

We'll use the official mongodb image from dockerhub, so we don't need a dockerfile for the db
https://hub.docker.com/_/mongo/

Our docker_compose service for the db looks like this:

db:
    image: mongo:3.2
    ports:
        - "27017:27017"
    volumes_from:
        - dbdata
dbdata:
    image: tianon/true
    volumes:
        - /data/db
    command: echo 'Data Container for docker-nemp-example'

db pulls an appropriate mongo image and opens port 27017, the standard mongo port.
it then uses volumes_from to abstract the data into a data container for maximum portability.
By doing this, multiple instances can share the same data container and also allows for easy backup and restore functionality.

## Link everything together

navigate to root
create docker-compose.yml (see example file)

## Test everything together

    $ docker-compose build 
    $ docker-compose up 

## TODO 

Remove db access stuff from api.js file and put in it's own file.