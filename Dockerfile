FROM node:12.17

WORKDIR /home/app

COPY . ./

RUN yarn

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]