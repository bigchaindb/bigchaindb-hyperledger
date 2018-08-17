
FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \
  curl \
  build-essential

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs

WORKDIR /rest_api

COPY  . .

RUN npm install