FROM node:16.10.0-alpine

WORKDIR /api

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
