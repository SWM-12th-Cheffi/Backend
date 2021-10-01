require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');
require('dotenv').config();

// http setting
import { createServer } from 'http';
const port: number = Number(process.env.PORT);

// router setting
import * as express from 'express';
const app: express.Application = express();
import { json } from 'body-parser';

// router import
import recipeRouter from './api/recipe';
import testRouter from './api/test';
import userRouter from './api/user';
import etcRouter from './api/etc';
import authRouter from './api/auth';
//import adminRouter from './api/admin';

// swagger Setting
import * as swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger';
app.use('/api-json', swaggerUi.serve, swaggerUi.setup(swaggerJson));

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
//app.use('/admin', adminRouter);

module.exports = server;
