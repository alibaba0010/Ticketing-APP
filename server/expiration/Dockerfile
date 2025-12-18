FROM node:25-alpine

WORKDIR /usr/src/app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "run", "dev:expiration"]
