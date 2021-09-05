// http 세팅
import {createServer} from "http";
//import { hostname } from "os";
const port: number = Number(process.env.PORT) || 2001;

// router 세팅
import * as express from "express";
const app: express.Application = express();
import {json} from 'body-parser';

// router import
import recipeRouter from "./api/recipe";
import testRouter from "./api/test";
import userRouter from "./api/user";
import etcRouter from "./api/etc";



const server = createServer((request, response)=> {
    app.use(json());
    app.use('/recipe', recipeRouter);
    app.use('/', testRouter);
    app.use('/user', userRouter);
    app.use('/etc', etcRouter);
});

server.listen(port, () => {
    console.log(`${port}포트 서버 대기 중!`);
});

module.exports = server