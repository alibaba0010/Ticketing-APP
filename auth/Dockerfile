FROM node:18-alpine
ARG APP_DIR
WORKDIR /usr/src/app
COPY $APP_DIR/package*.json ./

RUN npm install

COPY ./ ./

# RUN npm run dev:auth
CMD [ "npm", "run", "dev:auth" ]

EXPOSE 3001
