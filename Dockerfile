FROM node:16

WORKDIR /admin
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build
CMD yarn start