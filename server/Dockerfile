
#Based on:
#https://github.com/philipjkim/docker-polymer-cli-nginx
#https://hub.docker.com/r/jefferyb/polymer-cli/~/dockerfile/

# Use the official node image
FROM node:4-slim

MAINTAINER Tom Edge <tomedge@rugged.work>

USER root

#Update the package manager
RUN apt-get update

#Clean the package manager?
RUN apt-get clean

#set the working dir as the folder we've just created
WORKDIR /opt/server

#Copy package json
COPY ./package.json /opt/server/package.json

#install the app dependencies
RUN npm install

#Copy everything else to a folder called server
COPY . /opt/server

#TODO add gulp build process if necessary
#RUN gulp build

#Expose the appropriate port
EXPOSE 3000

#Start the app
CMD ["npm", "start"]