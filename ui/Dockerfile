FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y curl build-essential nginx

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs

RUN npm install yarn -g

WORKDIR /app

COPY package.json .

RUN yarn

ADD ./nginx.conf /etc/nginx/nginx.conf

COPY . .

RUN yarn build:nonproduction

CMD ["nginx", "-g", "daemon off;"]