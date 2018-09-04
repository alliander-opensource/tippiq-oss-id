FROM eu.gcr.io/tippiq-platform/node-base-6-9-1:node-6-9-1-b3

ENV NODE_ENV=production

WORKDIR /opt/app

COPY . /opt/app

RUN \
  yarn && \
  yarn run build
# todo: 'yarn install -- production' failes, removed for now

EXPOSE 3001

CMD [ "yarn", "start" ]

