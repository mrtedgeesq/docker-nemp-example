
#Based on:
#https://github.com/philipjkim/docker-polymer-cli-nginx
#https://hub.docker.com/r/jefferyb/polymer-cli/~/dockerfile/

# Use the official node image
FROM node:4-slim

MAINTAINER Tom Edge <tomedge@rugged.work>

USER root

#Update the package manager
RUN apt-get update

#Install git
RUN apt-get install -y --no-install-recommends git 

#Clean the package manager?
RUN apt-get clean

#Install polymer cli, gulp + bower
RUN npm install -g gulp bower polymer-cli

#Install nginx
RUN apt-get install -y nginx

#Copy the nginx config to the correct place
COPY conf/nginx/nginx.conf /etc/nginx/nginx.conf

#Copy everything else to a folder called polymer
COPY . /opt/polymer

#set the working dir as the folder we've just created
WORKDIR /opt/polymer

#install the app dependencies
RUN bower install --allow-root

#build the app - resulting files will be in /opt/polymer/build/bundled
RUN polymer build

#Expose the appropriate port (TODO change to 8080 for https)
EXPOSE 80

#Start the app
CMD ["nginx"]