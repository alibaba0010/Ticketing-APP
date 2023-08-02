FROM node:18-alpine
ARG APP_DIR
WORKDIR /usr/src/app
COPY $APP_DIR/package*.json ./

RUN npm install
# --only=prod

COPY ./ ./

CMD [ "npm", "run", "dev:tickets" ]

EXPOSE 3001
