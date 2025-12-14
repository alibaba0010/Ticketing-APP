FROM node:18-alpine

# ARG APP_DIR

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --omit=dev

COPY ./ ./

CMD [ "npm", "run", "dev:orders" ]

EXPOSE 3003
