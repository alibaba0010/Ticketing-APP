FROM node:18-alpine
ARG APP_DIR
WORKDIR /usr/src/app
COPY $APP_DIR/package*.json ./

RUN npm install

COPY ./ ./


CMD [ "/bin/sh" ]

EXPOSE 3001
