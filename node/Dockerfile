FROM node:14.17.3
WORKDIR /usr/src/node
COPY . .
RUN npm install
EXPOSE 2001
ENTRYPOINT npm run start:dev