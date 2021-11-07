require('dotenv').config();
const debugApp = require('debug')('cheffi:app');
const logger = require('morgan');

// http setting
import { createServer } from 'http';

const port: number = Number(process.env.PORT);

// router setting
import * as express from 'express';
const app: express.Application = express();
import { json } from 'body-parser';

// router import
import recipeRouter from './api/Recipe';
import testRouter from './api/Test';
import userRouter from './api/User';
import authRouter from './api/Auth';
import adminRouter from './api/Admin';

// swagger Setting
import * as swaggerUi from 'swagger-ui-express';
import swaggerJson from './Swagger';
app.use('/api-json', swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use(logger('dev'));

const server = createServer(app);
server.listen(port, () => {
  debugApp(`${port}포트 서버 대기 중!`);
});

app.use(json());

app.use('/', testRouter);
app.use('/auth', authRouter);
app.use('/recipe', recipeRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

module.exports = server;
