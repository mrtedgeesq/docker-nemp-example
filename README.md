# TL;DR

This project gives an example of how to get the NEMP stack to play nice when everything is containerised with Docker.

# NEMP stack?

Node, Express, Mongo & Polymer. 

It's basically the MEAN stack with Polymer instead of Angular, but NEMP is easier to say than MEPN

I :heart: this stack

# How to use

If you just want to jump straight in and give this a try navigate to the project root and run

    docker-compose build
    docker-compose up -d
    docker-machine ip
    
then go to the given ip in your browser

you should see three ticks in the status boxes if everything is ok

To stop run
    docker-compose down

# References

Thanks to the authors of all the posts below, these have been a great help!

* How to build a 3 tier architecture in docker
https://blog.bergeron.io/simple-web-architecture-with-docker/

* Great article which explains how to set up mongo in docker amongst other things
https://medium.com/@sunnykay/docker-development-workflow-node-express-mongo-4bb3b1f7eb1e#.oqolacqz2

* Mongoose Getting Started
http://mongoosejs.com/docs/ 

* Using polymer cli to build polymer app in docker
https://hub.docker.com/r/jefferyb/polymer-cli/~/dockerfile/

# Howto

If you want to do something similar, follow the steps below. Note: I haven't tested this procedure - these were just my rough notes as I built this example. Please let me know if you have any issues with it and I'll try to help you.

## Setup environment
Install:
* node
* polymer cli
* docker
* docker-compose
* express generator

## Setup sample polymer project

navigate to project root:

    mkdir client
    cd client
    polymer init
    
select 'application' for basic application setup

### Test application

    polymer serve --open

## Setup app for serving on Nginx

navigate to /client

    mkdir conf/nginx
    cd conf/nginx
    
create file nginx.conf (see example file for content)

### Create dockerfile for client

Client will be served in production with Nginx therefore we need to provide a config file

navigate to /client
create Dockerfile (see example file /client/Dockerfile)

## Test client dockerfile

Start docker (using docker quickstart terminal)

    $ docker build -t yourname/nemp-client .
    $ docker run -p 80:80 -d yourname/nemp-client
    $ docker-machine ip 
    
Go to the ip shown in your browser

## (Optional) Stop the docker container

    $ docker ps

This will output something like 

    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                NAMES
    61f519699247        yourname/nemp-client      "nginx"             About an hour ago   Up About an hour    0.0.0.0:80->80/tcp   sleepy_nobel

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

Because the client and server will be on different ports, if we try to make a call to the server we'll get a cross origin resource sharing (CORS) exception. In order to get round that, we need to add some headers to the response from the server to allow CORS. We do that by adding a piece of middleware to the express setup.

This needs to go immediately after the `var app = express();` line:

```javascript
var app = express();

// Allow cross origin resource sharing
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
```

### Test server

    > SET DEBUG=server:*
    > npm start

open http://localhost:3000/ in browser

### Create dockerfile for server

navigate to /server
create Dockerfile (see example file /server/dockerfile)

### Test server dockerfile

navigate to /server
```
    $ docker build -t yourname/nemp-server .
    docker run -p 3000:3000 -d yourname/nemp-server
    $ docker-machine ip 
```    

At this stage you should be able to run both dockerfiles on the same host & check them against each other.

## Link everything together

navigate to root
create docker-compose.yml (see example file)

## Where's my database? 

We'll use the official mongodb image from dockerhub, so we don't need a dockerfile for the db
https://hub.docker.com/_/mongo/

Our docker_compose service for the db looks like this:

```
mongo:
    image: mongo:3.2
    ports:
        - "27017:27017"
    volumes_from:
        - mongodata
mongodata:
    image: tianon/true
    volumes:
        - /data/db
```

The mongo service pulls an appropriate mongo image and opens port 27017, the standard mongo port.
It then uses `volumes_from` to abstract the data into a data container for maximum portability.
By doing this, multiple instances can share the same data container and also allows for easy backup and restore functionality.

Note - we use tianon/true for the image. All this does is return `true` - we're just using it as a blank image so that we can set up the volumes

## Test everything together

    $ docker-compose build 
    $ docker-compose up 

## TODO 

* Remove db access stuff from api.js file and put in its own file.
