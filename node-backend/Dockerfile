FROM  node:18-alpine

WORKDIR /api

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
