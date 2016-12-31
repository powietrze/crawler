FROM netczuk/node-yarn:node-7.3.0-alpine-yarn-0.18.1
MAINTAINER Tomasz Netczuk <contact@netczuk.pl>

ADD ./crawl-cron /etc/periodic/15min
RUN chmod a+x /etc/periodic/15min/crawl-cron

WORKDIR /app

ADD package.json /app
ADD yarn.lock /app
RUN yarn install --production

ADD . /app

CMD crond -f
