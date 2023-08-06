FROM node:18-alpine
ENV APP_DIR=$APP_DIR

ARG APP_DIR

WORKDIR /usr/src/app

COPY $APP_DIR/package.json ./

RUN npm install --omit=dev

COPY ./ ./

CMD [ "npm", "run", "dev:tickets" ]

EXPOSE 3002
