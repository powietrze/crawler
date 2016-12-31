FROM netczuk/node-yarn:node-7.3.0-alpine-yarn-0.18.1
MAINTAINER Tomasz Netczuk <contact@netczuk.pl>

WORKDIR /app
ADD . /app

RUN yarn install --production

CMD yarn start
