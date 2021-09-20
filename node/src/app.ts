require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');
require('dotenv').config();

// http 세팅
import { createServer } from 'http';
//import { hostname } from "os";
const port: number = Number(process.env.PORT);

// router 세팅
import * as express from 'express';
const app: express.Application = express();
import { json } from 'body-parser';

// router import
import recipeRouter from './api/recipe';
import testRouter from './api/test';
import userRouter from './api/user';
import etcRouter from './api/etc';
import authRouter from './api/auth';

// swagger Setting
import * as swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger';
app.use('/api-json', swaggerUi.serve, swaggerUi.setup(swaggerJson));

// mongo Setting
var mongoose = require('mongoose');
var mongoAddr: string = String(process.env.MONGO_ADDR);

mongoose.createConnection(mongoAddr + 'recipe');
mongoose.createConnection(mongoAddr + 'user');

const server = createServer(app);
server.listen(port, () => {
  console.log(`${port}포트 서버 대기 중!`);
});

app.use(json());

app.use('/', testRouter);
app.use('/Auth', authRouter);
app.use('/recipe', recipeRouter);
app.use('/user', userRouter);
app.use('/etc', etcRouter);

module.exports = server;
