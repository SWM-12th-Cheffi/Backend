require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

// http 세팅
import { createServer } from 'http';
//import { hostname } from "os";
const port: number = Number(process.env.PORT) || 2001;

// router 세팅
import * as express from 'express';
const app: express.Application = express();
import { json } from 'body-parser';

// router import
import recipeRouter from './api/recipe';
import testRouter from './api/test';
import userRouter from './api/user';
import etcRouter from './api/etc';

// swagger Setting
import * as swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger';
app.use('/api-json', swaggerUi.serve, swaggerUi.setup(swaggerJson));

// mongo Setting
var mongoose = require('mongoose');
// local
var mongoAddr: string = 'mongodb://18.220.121.204:27017/';
// server
//var mongoAddr: string = 'mongodb://172.29.0.5:27017/';

var recipe = mongoose
  .createConnection(mongoAddr + 'recipe')
  .then(function () {
    console.log('recipe Connect Successful');
  })
  .catch(function (error: string) {
    console.log(error);
  });
var user = mongoose
  .createConnection(mongoAddr + 'user')
  .then(function () {
    console.log('user Connect Successful');
  })
  .catch(function (error: string) {
    console.log(error);
  });

const server = createServer(app);
server.listen(port, () => {
  console.log(`${port}포트 서버 대기 중!`);
});

app.use(json());

app.use('/', testRouter);
app.use('/recipe', recipeRouter);
app.use('/user', userRouter);
app.use('/etc', etcRouter);

module.exports = server;
