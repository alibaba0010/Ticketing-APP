FROM node:18-alpine
WORKDIR /usr/src/app
# COPY $APP_DIR/package*.json ./

#
COPY package.json .
RUN npm install --only=prod
# --omit=dev
COPY . .

CMD ["npm", "run", "dev"]
EXPOSE 3000
