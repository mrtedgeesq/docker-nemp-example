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

#Copy the bower files
COPY ./bower.json /opt/polymer/bower.json

#set the working dir as the folder we've just created
WORKDIR /opt/polymer

#install the app dependencies (do this before the main copy so that we don't have to refresh all the dependencies on every code chage)
RUN bower install --allow-root

#Copy everything else to a folder called polymer
COPY . /opt/polymer

#Copy the nginx config to the correct place
COPY conf/nginx/nginx.conf /etc/nginx/nginx.conf

#build the app - resulting files will be in /opt/polymer/build/bundled
RUN polymer build

#Expose the appropriate port (TODO change to 8080 for https)
EXPOSE 80

#Start the app
CMD ["nginx"]